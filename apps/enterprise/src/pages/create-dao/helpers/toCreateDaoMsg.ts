import { CreateDaoMsgType } from 'tx/useCreateDaoTx';
import { microfy } from '@terra-money/apps/libs/formatting';
import { DaoWizardInput, DaoWizardState } from '../DaoWizardFormProvider';
import { enterprise_factory } from 'types/contracts';
import { assertDefined } from '@terra-money/apps/utils';

const getDaoMembership = (input: DaoWizardInput) => {
  const {
    type,
    members,
    nftMembership,
    tokenInfo: { name, symbol, decimals },
    initialBalances,
    tokenMarketing,
    daoImport,
  } = input;

  if (daoImport.shouldImport) {
    const existingContractAddr =
      type === 'token'
        ? input.existingTokenAddr
        : type === 'nft'
        ? input.existingNFTAddr
        : type === 'multisig'
        ? input.existingMultisigAddr
        : undefined;

    return {
      existing_membership: {
        dao_type: type,
        membership_contract_addr: assertDefined(existingContractAddr, 'daoAddress'),
      },
    };
  }

  const converter: Record<DaoWizardInput['type'], () => CreateDaoMsgType['create_dao']['dao_membership']> = {
    multisig: () => ({
      new_membership: {
        new_multisig: {
          multisig_members: members.map((member) => ({ address: member.addr, weight: member.weight.toString() })),
        },
      },
    }),
    nft: () => ({
      new_membership: {
        new_nft: {
          minter: nftMembership.minter,
          nft_name: nftMembership.nftName,
          nft_symbol: nftMembership.nftSymbol,
        },
      },
    }),
    token: () => ({
      new_membership: {
        new_token: {
          initial_token_balances: initialBalances.map(({ address, amount }) => ({
            address,
            amount: microfy(amount, decimals).toString(),
          })),
          token_decimals: decimals,
          token_marketing: {
            description: tokenMarketing.description,
            logo_url: tokenMarketing.logo,
            marketing_owner: tokenMarketing.marketingOwner,
            project: tokenMarketing.project,
          },
          token_name: name,
          token_symbol: symbol,
        },
      },
    }),
  };

  return converter[type]();
};

export const getDaoRatio = (ratio: number) => ratio.toFixed(2);

const getDaoGovConfig = ({ govConfig, type, timeConversionFactor }: DaoWizardState) => {
  const config: enterprise_factory.DaoGovConfig = {
    quorum: getDaoRatio(govConfig.quorum),
    threshold: getDaoRatio(govConfig.threshold),
    unlocking_period: {
      time: govConfig.unlockingPeriod * timeConversionFactor,
    },
    vote_duration: govConfig.voteDuration * timeConversionFactor,
  };

  if (type === 'token') {
    config.minimum_deposit = microfy(govConfig.minimumDeposit || 0).toString();
  }

  return config;
};

export const toCreateDaoMsg = (input: DaoWizardState): CreateDaoMsgType => {
  const {
    info: { name, logo },
    socials,
  } = input;

  return {
    create_dao: {
      asset_whitelist: null,
      dao_membership: getDaoMembership(input),
      dao_metadata: {
        logo: logo ? { url: logo } : 'none',
        name,
        socials: {
          github_username: socials.githubUsername,
          twitter_username: socials.twitterUsername,
          discord_username: socials.discordUsername,
          telegram_username: socials.telegramUsername,
        },
      },
      dao_gov_config: getDaoGovConfig(input),
    },
  };
};
