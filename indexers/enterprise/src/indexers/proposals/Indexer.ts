import { EventIndexer, IndexFnOptions } from 'indexers/EventIndexer';
import { Entity } from './types';
import { LCDClient } from '@terra-money/terra.js';
import { TableNames, DAOS_PK_NAME, DAOS_SK_NAME } from 'initializers';
import { batch, createLCDClient } from '@apps-shared/indexers/utils';
import { KeySelector } from '@apps-shared/indexers/services/persistence';
import { fetchByHeight } from '@apps-shared/indexers/services/event-store';
import { CreateProposalEvent, EnterpriseEventPK, ExecuteProposalEvent } from 'types/events';
import { enterprise } from 'types/contracts';
import Big from 'big.js';

export const PK: KeySelector<Entity> = (data) => data.daoAddress;

export const SK: KeySelector<Entity> = (data) => `proposal:${data.id}`;

export class Indexer extends EventIndexer<Entity> {
  constructor() {
    super({
      name: 'proposals',
      tableName: TableNames.daos(),
      pk: PK,
      pkName: DAOS_PK_NAME,
      sk: SK,
      skName: DAOS_SK_NAME,
    });
  }

  private getModifiedProposals = async (min: number, max: number): Promise<Array<string>> => {
    const pks = [
      EnterpriseEventPK.dao('create_proposal'),
      EnterpriseEventPK.dao('execute_proposal'),
      EnterpriseEventPK.dao('cast_vote'),
    ];

    type Events = CreateProposalEvent | ExecuteProposalEvent;

    const promises = await Promise.all(
      pks.map((pk) =>
        fetchByHeight<Events, string>(this.events, pk, min, max, (event) => [
          `${event.payload._contract_address}:${event.payload.proposal_id}`,
        ])
      )
    );

    return Array.from(new Set<string>(promises.flatMap((s) => s))).filter(Boolean);
  };

  private fetchProposal = async (lcd: LCDClient, daoAddress: string, id: number): Promise<Entity> => {
    const response = await lcd.wasm.contractQuery<enterprise.ProposalResponse>(daoAddress, {
      proposal: {
        proposal_id: id,
      },
    });

    const [yesVotes, noVotes, abstainVotes, vetoVotes] = response.results.reduce(
      (previous, [t, v]) => {
        previous[t] = v;
        return previous;
      },
      ['0', '0', '0', '0']
    );

    const created =
      'started_at' in response.proposal ? Math.trunc(Big(response.proposal.started_at).div(1000000).toNumber()) : 0;

    return {
      _type: 'proposal',
      daoAddress,
      id,
      created: created,
      started_at: created,
      title: response.proposal.title,
      description: response.proposal.description,
      expires: response.proposal.expires,
      status: response.proposal.status,
      proposalActions: response.proposal.proposal_actions,
      yesVotes,
      noVotes,
      abstainVotes,
      vetoVotes,
      totalVotes: response.total_votes_available,
    };
  };

  private synchronize = async (proposals: string[]): Promise<void> => {
    const lcd = createLCDClient();

    const entities = [];

    for (let [address, id] of proposals.map((p) => p.split(':'))) {
      entities.push(await this.fetchProposal(lcd, address, +id));
    }

    await this.persistence.save(entities);
  };

  override index = async (options: IndexFnOptions): Promise<void> => {
    const { current, genesis } = options;

    let { height } = await this.state.get({ height: genesis.height });

    await batch(height, current.height, 1000, async ({ min, max }) => {
      this.logger.info(`Processing blocks between ${min} and ${max}.`);

      await this.synchronize(await this.getModifiedProposals(min, max));

      await this.state.set({ height: max });
    });
  };
}
