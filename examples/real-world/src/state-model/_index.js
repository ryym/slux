// Viewで使うメソッド

// getters

getErrorMessage
getCurrentPath
getRouterParams
getStargazersPaginationInfo
getStarredPaginationInfo
getStargazers
getStarredRepos
getOwners
getRepo
getUser

// commands

navigate
updateRouterState
setErrorMessage
loadRepo
loadUser
loadStargazers
loadStarred


{
  users: KeyNormalizable,
  repos: KeyNormalizable,
  pagination: {
    stargazers: KeyNormalizable,
    starredRepos: KeyNormalizable,
  },
  router: {}
}

// class {
//   getUser
//   getRepo
//   getStargazers
// }

// const createState = (createResource) => {
//   const users = createResource()
//   //
//   return {
//     getUser: getUser(users),
//     getRepo: getRepo(repos),
//     loadRepo: loadRepo(fetchUser, )
//     pagination: {
//     }
//   }
// }

// Load系は結局外でやるしかなさそう
class AppState {
  constructor(createResource, createPagination) {
    this.users = createResource()
    
    // this.pagination = {
    //   stargazers: createPagination(createResource)
    // }
    this.stargazers = createPagination(createResource)
  }

  addUsers(newUsers) {
    this.users.merge(newUsers)
  }

  startStargazersFetching(repoName) {
    this.stargazers.startFetching(repoName)
  }

  getStargazersPagination(repoName) {

  }
}
