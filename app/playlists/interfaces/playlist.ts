type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Thumbnails = {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard: Thumbnail;
  maxres: Thumbnail;
};

type Localized = {
  title: string;
  description: string;
};

type Snippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  localized: Localized;
};

type Status = {
  privacyStatus: string;
};

type ContentDetails = {
  itemCount: number;
};

export type PlaylistItem = {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  status: Status;
  contentDetails: ContentDetails;
};

export type Playlist = {
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: PlaylistItem[];
};