export interface TopicListQueryEntity {
  category?: number,
  search?: string,
  mine?: boolean,
  moreLiked?: boolean,
  page?: number,
  size?: number,
  sort?: string[]
}
