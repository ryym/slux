
const loadStarred = actionWith(fetchStarred)(
  'Load_Starred_Repos_From_Server',
  fetchStarred => ({ commit }, state, { login, loadMore }) => {
    const { pageCount = 0, nextPageUrl } = state.getStarredPagination(login)
    if (loadMore || pageCount === 0) {
      commit(requestStarred, login)
      catchError(commit, fetchStarred(login, nextPageUrl))
        .then(response => commit(receiveStarred, reponse))
    }
  }
)
