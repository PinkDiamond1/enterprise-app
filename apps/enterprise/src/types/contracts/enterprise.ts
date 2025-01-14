export module enterprise {
  export type Uint128 = string;
  export type AssetInfoBaseFor_Addr =
    | {
        native: string;
      }
    | {
        cw20: Addr;
      }
    | {
        /**
         * @minItems 2
         * @maxItems 2
         */
        cw1155: [Addr, string];
      };
  export type Addr = string;
  export interface AssetTreasuryResponse {
    assets: AssetBaseFor_Addr[];
  }
  export interface AssetBaseFor_Addr {
    /**
     * Specifies the asset's amount
     */
    amount: Uint128;
    /**
     * Specifies the asset's type (CW20 or native)
     */
    info: AssetInfoBaseFor_Addr;
  }
  export interface AssetWhitelistResponse {
    assets: AssetInfoBaseFor_Addr[];
  }
  export type ClaimAsset =
    | {
        cw20: Cw20ClaimAsset;
      }
    | {
        cw721: Cw721ClaimAsset;
      };
  export type ReleaseAt =
    | {
        timestamp: Timestamp;
      }
    | {
        height: Uint64;
      };
  export type Timestamp = Uint64;
  export type Uint64 = string;
  export interface ClaimsResponse {
    claims: Claim[];
  }
  export interface Claim {
    asset: ClaimAsset;
    release_at: ReleaseAt;
  }
  export interface Cw20ClaimAsset {
    amount: Uint128;
  }
  export interface Cw721ClaimAsset {
    tokens: string[];
  }
  export type Cw20HookMsg =
    | {
        stake: {};
      }
    | {
        create_proposal: CreateProposalMsg;
      };
  export type ProposalAction =
    | {
        update_metadata: UpdateMetadataMsg;
      }
    | {
        update_gov_config: UpdateGovConfigMsg;
      }
    | {
        update_asset_whitelist: UpdateAssetWhitelistMsg;
      }
    | {
        update_nft_whitelist: UpdateNftWhitelistMsg;
      }
    | {
        request_funding_from_dao: RequestFundingFromDaoMsg;
      }
    | {
        upgrade_dao: UpgradeDaoMsg;
      }
    | {
        execute_msgs: ExecuteMsgsMsg;
      }
    | {
        modify_multisig_membership: ModifyMultisigMembershipMsg;
      };
  export type ModifyValueFor_Nullable_String =
    | 'no_change'
    | {
        change: string | null;
      };
  export type ModifyValueFor_Logo =
    | 'no_change'
    | {
        change: Logo;
      };
  export type Logo =
    | 'none'
    | {
        url: string;
      };
  export type ModifyValueFor_String =
    | 'no_change'
    | {
        change: string;
      };
  export type ModifyValueFor_Nullable_Uint128 =
    | 'no_change'
    | {
        change: Uint128 | null;
      };
  export type ModifyValueFor_Decimal =
    | 'no_change'
    | {
        change: Decimal;
      };
  export type Decimal = string;
  export type ModifyValueFor_Duration =
    | 'no_change'
    | {
        change: Duration;
      };
  export type Duration =
    | {
        height: number;
      }
    | {
        time: number;
      };
  export type ModifyValueFor_Uint64 =
    | 'no_change'
    | {
        change: Uint64;
      };
  export interface CreateProposalMsg {
    /**
     * Optional description text of the proposal
     */
    description?: string | null;
    /**
     * Actions to be executed, in order, if the proposal passes
     */
    proposal_actions: ProposalAction[];
    /**
     * Title of the proposal
     */
    title: string;
  }
  export interface UpdateMetadataMsg {
    discord_username: ModifyValueFor_Nullable_String;
    github_username: ModifyValueFor_Nullable_String;
    logo: ModifyValueFor_Logo;
    name: ModifyValueFor_String;
    telegram_username: ModifyValueFor_Nullable_String;
    twitter_username: ModifyValueFor_Nullable_String;
  }
  export interface UpdateGovConfigMsg {
    minimum_deposit: ModifyValueFor_Nullable_Uint128;
    quorum: ModifyValueFor_Decimal;
    threshold: ModifyValueFor_Decimal;
    unlocking_period: ModifyValueFor_Duration;
    voting_duration: ModifyValueFor_Uint64;
  }
  export interface UpdateAssetWhitelistMsg {
    /**
     * New assets to add to the whitelist. Will ignore assets that are already whitelisted.
     */
    add: AssetInfoBaseFor_Addr[];
    /**
     * Assets to remove from the whitelist. Will ignore assets that are not already whitelisted.
     */
    remove: AssetInfoBaseFor_Addr[];
  }
  export interface UpdateNftWhitelistMsg {
    /**
     * New NFTs to add to the whitelist. Will ignore NFTs that are already whitelisted.
     */
    add: Addr[];
    /**
     * NFTs to remove from the whitelist. Will ignore NFTs that are not already whitelisted.
     */
    remove: Addr[];
  }
  export interface RequestFundingFromDaoMsg {
    assets: AssetBaseFor_Addr[];
    recipient: string;
  }
  export interface UpgradeDaoMsg {
    migrate_msg: string;
    new_dao_code_id: number;
  }
  export interface ExecuteMsgsMsg {
    msgs: string[];
  }
  export interface ModifyMultisigMembershipMsg {
    /**
     * Members to be edited. Can contain existing members, in which case their new weight will be the one specified in this message. This effectively allows removing of members (by setting their weight to 0).
     */
    edit_members: MultisigMember[];
  }
  export interface MultisigMember {
    address: string;
    weight: Uint128;
  }
  export type Cw721HookMsg = {
    stake: {};
  };
  export type DaoType = 'token' | 'nft' | 'multisig';
  export interface DaoInfoResponse {
    creation_date: Timestamp;
    dao_code_version: Uint64;
    dao_membership_contract: Addr;
    dao_type: DaoType;
    enterprise_factory_contract: Addr;
    gov_config: DaoGovConfig;
    metadata: DaoMetadata;
  }
  export interface DaoGovConfig {
    /**
     * Optional minimum amount of DAO's governance unit to be required to create a deposit.
     */
    minimum_deposit?: Uint128 | null;
    /**
     * Portion of total available votes cast in a proposal to consider it valid e.g. quorum of 30% means that 30% of all available votes have to be cast in the proposal, otherwise it fails automatically when it expires
     */
    quorum: Decimal;
    /**
     * Portion of votes assigned to a single option from all the votes cast in the given proposal required to determine the 'winning' option e.g. 51% threshold means that an option has to have at least 51% of the cast votes to win
     */
    threshold: Decimal;
    /**
     * Duration that has to pass for unstaked membership tokens to be claimable
     */
    unlocking_period: Duration;
    /**
     * Duration of proposals before they end, expressed in seconds
     */
    vote_duration: number;
  }
  export interface DaoMetadata {
    logo: Logo;
    name: string;
    socials: DaoSocialData;
  }
  export interface DaoSocialData {
    discord_username?: string | null;
    github_username?: string | null;
    telegram_username?: string | null;
    twitter_username?: string | null;
  }
  export type ExecuteMsg =
    | {
        create_proposal: CreateProposalMsg;
      }
    | {
        cast_vote: CastVoteMsg;
      }
    | {
        execute_proposal: ExecuteProposalMsg;
      }
    | {
        unstake: UnstakeMsg;
      }
    | {
        claim: {};
      }
    | {
        receive: Cw20ReceiveMsg;
      }
    | {
        receive_nft: Cw721ReceiveMsg;
      };
  export type DefaultVoteOption = 'yes' | 'no' | 'abstain' | 'veto';
  export type UnstakeMsg =
    | {
        cw20: UnstakeCw20Msg;
      }
    | {
        cw721: UnstakeCw721Msg;
      };
  export type Binary = string;
  export interface CastVoteMsg {
    outcome: DefaultVoteOption;
    proposal_id: number;
  }
  export interface ExecuteProposalMsg {
    proposal_id: number;
  }
  export interface UnstakeCw20Msg {
    amount: Uint128;
  }
  export interface UnstakeCw721Msg {
    tokens: string[];
  }
  export interface Cw20ReceiveMsg {
    amount: Uint128;
    msg: Binary;
    sender: string;
  }
  export interface Cw721ReceiveMsg {
    msg: Binary;
    sender: string;
    token_id: string;
  }
  export type DaoMembershipInfo =
    | {
        new: NewDaoMembershipMsg;
      }
    | {
        existing: ExistingDaoMembershipMsg;
      };
  export type NewMembershipInfo =
    | {
        new_token: NewTokenMembershipInfo;
      }
    | {
        new_nft: NewNftMembershipInfo;
      }
    | {
        new_multisig: NewMultisigMembershipInfo;
      };
  export interface InstantiateMsg {
    /**
     * Assets that are allowed to show in DAO's treasury
     */
    asset_whitelist?: AssetInfoBaseFor_Addr[] | null;
    dao_gov_config: DaoGovConfig;
    dao_membership_info: DaoMembershipInfo;
    dao_metadata: DaoMetadata;
    /**
     * Address of enterprise-factory contract that is creating this DAO
     */
    enterprise_factory_contract: string;
    /**
     * NFTs (CW721) that are allowed to show in DAO's treasury
     */
    nft_whitelist?: Addr[] | null;
  }
  export interface NewDaoMembershipMsg {
    membership_contract_code_id: number;
    membership_info: NewMembershipInfo;
  }
  export interface NewTokenMembershipInfo {
    initial_token_balances: Cw20Coin[];
    token_decimals: number;
    token_marketing?: TokenMarketingInfo | null;
    token_mint?: MinterResponse | null;
    token_name: string;
    token_symbol: string;
  }
  export interface Cw20Coin {
    address: string;
    amount: Uint128;
  }
  export interface TokenMarketingInfo {
    description?: string | null;
    logo_url?: string | null;
    marketing_owner?: string | null;
    project?: string | null;
  }
  export interface MinterResponse {
    /**
     * cap is a hard cap on total supply that can be achieved by minting. Note that this refers to total_supply. If None, there is unlimited cap.
     */
    cap?: Uint128 | null;
    minter: string;
  }
  export interface NewNftMembershipInfo {
    minter?: string | null;
    nft_name: string;
    nft_symbol: string;
  }
  export interface NewMultisigMembershipInfo {
    multisig_members: MultisigMember[];
  }
  export interface ExistingDaoMembershipMsg {
    dao_type: DaoType;
    membership_contract_addr: string;
  }
  export interface MemberInfoResponse {
    voting_power: Decimal;
  }
  export interface MemberVoteResponse {
    vote?: Vote | null;
  }
  export interface Vote {
    /**
     * Number of votes on the outcome.
     */
    amount: number;
    /**
     * The outcome, 0-indexed.
     */
    outcome: number;
    /**
     * Unique identifier for the poll.
     */
    poll_id: number;
    /**
     * Voter address.
     */
    voter: Addr;
  }
  export interface MigrateMsg {}
  export interface MultisigMembersResponse {
    members: MultisigMember[];
  }
  export interface NftTreasuryResponse {
    nfts: NftCollection[];
  }
  export interface NftCollection {
    nft_address: Addr;
    token_ids: string[];
  }
  export interface NftWhitelistResponse {
    nfts: Addr[];
  }
  export type PollStatus =
    | {
        in_progress: {
          ends_at: Timestamp;
        };
      }
    | {
        passed: {
          count: Uint128;
          outcome: number;
        };
      }
    | {
        rejected: {
          count?: Uint128 | null;
          outcome?: number | null;
          reason: PollRejectionReason;
        };
      };
  export type PollRejectionReason =
    | ('quorum_not_reached' | 'threshold_not_reached' | 'quorum_and_threshold_not_reached' | 'is_rejecting_outcome')
    | {
        /**
         * @minItems 3
         * @maxItems 3
         */
        outcome_draw: [number, number, Uint128];
      };
  export interface PollStatusResponse {
    /**
     * Poll end time.
     */
    ends_at: Timestamp;
    /**
     * Total vote-count (value) for each outcome (key).
     */
    results: [number, Uint128][];
    /**
     * Status of the poll.
     */
    status: PollStatus;
  }
  export interface PollVoterResponse {
    /**
     * The voter's vote on the specific poll.
     */
    vote?: Vote | null;
  }
  export interface PollVotersResponse {
    /**
     * All votes on the specific poll.
     */
    votes: Vote[];
  }
  export type PollType =
    | 'default'
    | {
        multichoice: {
          /**
           * Number of outcomes, 0-indexed.
           */
          n_outcomes: number;
          /**
           * List of possible winning outcomes that will cause a poll's status to become "Rejected". Can for example be used to create a Yes/No poll.
           */
          rejecting_outcomes: number[];
          /**
           * Threshold ratio, i.e. sum(most_voted) / total_votes.
           */
          threshold: Decimal;
        };
      };
  export type VotingScheme = 'coin_voting';
  export interface PollsResponse {
    /**
     * The polls.
     */
    polls: Poll[];
  }
  export interface Poll {
    /**
     * Poll deposit amount.
     */
    deposit_amount: number;
    /**
     * User-defined description for the poll.
     */
    description: string;
    /**
     * End-time of poll.
     */
    ends_at: Timestamp;
    /**
     * Unique identifier for the poll.
     */
    id: number;
    /**
     * User-defined label for the poll.
     */
    label: string;
    /**
     * Type of the poll
     */
    poll_type: PollType;
    /**
     * Proposer address.
     */
    proposer: Addr;
    /**
     * Quorum to be reached for the poll to be valid
     */
    quorum: Decimal;
    /**
     * Total vote-count (value) for each outcome (key).
     */
    results: [number, Uint128][];
    /**
     * Voting scheme of the poll, e.g. "CoinVoting".
     */
    scheme: VotingScheme;
    /**
     * Start-time of poll.
     */
    started_at: Timestamp;
    /**
     * Status of the poll.
     */
    status: PollStatus;
  }
  export type Expiration =
    | {
        at_height: number;
      }
    | {
        at_time: Timestamp;
      }
    | {
        never: {};
      };
  export type ProposalStatus = 'in_progress' | 'passed' | 'rejected' | 'executed';
  export interface ProposalResponse {
    proposal: Proposal;
    /**
     * Total vote-count (value) for each outcome (key).
     */
    results: [number, Uint128][];
    total_votes_available: Uint128;
  }
  export interface Proposal {
    description: string;
    expires: Expiration;
    id: number;
    proposal_actions: ProposalAction[];
    started_at: Timestamp;
    status: ProposalStatus;
    title: string;
  }
  export interface ProposalStatusResponse {
    expires: Expiration;
    /**
     * Total vote-count (value) for each outcome (key).
     */
    results: [number, Uint128][];
    status: ProposalStatus;
  }
  export interface ProposalVotesResponse {
    votes: Vote[];
  }
  export interface ProposalsResponse {
    proposals: ProposalResponse[];
  }
  export type QueryMsg =
    | {
        dao_info: {};
      }
    | {
        member_info: QueryMemberInfoMsg;
      }
    | {
        list_multisig_members: ListMultisigMembersMsg;
      }
    | {
        asset_whitelist: {};
      }
    | {
        nft_whitelist: {};
      }
    | {
        proposal: ProposalParams;
      }
    | {
        proposals: ProposalsParams;
      }
    | {
        proposal_status: ProposalStatusParams;
      }
    | {
        member_vote: MemberVoteParams;
      }
    | {
        proposal_votes: ProposalVotesParams;
      }
    | {
        user_stake: UserStakeParams;
      }
    | {
        total_staked_amount: {};
      }
    | {
        claims: ClaimsParams;
      }
    | {
        releasable_claims: ClaimsParams;
      }
    | {
        cw20_treasury: {};
      }
    | {
        nft_treasury: {};
      };
  export type ProposalStatusFilter = 'in_progress' | 'passed' | 'rejected';
  export interface QueryMemberInfoMsg {
    member_address: string;
  }
  export interface ListMultisigMembersMsg {
    limit?: number | null;
    start_after?: string | null;
  }
  export interface ProposalParams {
    proposal_id: number;
  }
  export interface ProposalsParams {
    /**
     * Optional proposal status to filter for.
     */
    filter?: ProposalStatusFilter | null;
    limit?: number | null;
    start_after?: number | null;
  }
  export interface ProposalStatusParams {
    proposal_id: number;
  }
  export interface MemberVoteParams {
    member: string;
    proposal_id: number;
  }
  export interface ProposalVotesParams {
    limit?: number | null;
    proposal_id: number;
    /**
     * Optional pagination data, will return votes after the given voter address
     */
    start_after?: string | null;
  }
  export interface UserStakeParams {
    user: string;
  }
  export interface ClaimsParams {
    owner: string;
  }
  export interface TotalStakedAmountResponse {
    total_staked_amount: Uint128;
  }
  export type UserStake =
    | 'none'
    | {
        token: TokenUserStake;
      }
    | {
        nft: NftUserStake;
      };
  export interface UserStakeResponse {
    user_stake: UserStake;
  }
  export interface TokenUserStake {
    amount: Uint128;
  }
  export interface NftUserStake {
    amount: Uint128;
    tokens: string[];
  }
}
