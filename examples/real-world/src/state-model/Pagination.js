const getInitialState = ({
  isFetching: false,
  nextPageUrl: undefined,
  pageCount: 0,
  ids: []
})

class Pagination {
  constructor(initialData) {
    this.pagination = initialData
  }

  get(key) {
    return this.pagination.get(key)
  }

  startFetching(key) {
    this.pagination = this.pagination.updateOrCreate(key, pgInfo => ({
      ...pgInfo,
      isFetching = true
    }), getInitialState())
  }

  finishFetching(key, { ids, nextPageUrl }) {
    this.pagination = this.pagination.update(key, pgInfo => ({
      nextPageUrl,
      isFetching: false,
      pageCount: pgInfo.pageCount + 1,
      ids: union(pgInfo.ids, ids)
    }))
  }
}
