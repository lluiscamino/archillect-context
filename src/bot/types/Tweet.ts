type Tweet = {
  readonly id?: string;
  readonly rt: boolean;
  readonly status: string | undefined;
  readonly inReplyToId?: string;
  readonly mediaHttpsUrls: string[];
};

export default Tweet;
