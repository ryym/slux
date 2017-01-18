const createGitHubState = () => {
  return new GitHub({
    users: new EntityMap(),
    repos: new EntityMap(),
    starredRepos: new Pagination(new EnttiyMap()),
    stargazers: new Pagination(new EnttiyMap()),
  })
}

class GitHub {
  constructor({ users, repos, starredRepos, stargazers }) {

  }

  getUser(login) {
    return this.users.get(login)
  }

  getRepo(repoName) {
    return this.repos.get(repoName)
  }

  getStargazersPagination(repoName) {
    return this.stargazers.get(repoName)
  }

  getStarredPagination(login) {
    return this.starredRepos.get(login)
  }

  getStarredRepos(login) {
    const { ids } = this.starredRepos.get(login)
    return ids.map(this.getRepo)
  }

  getStargazers(repoName) {
    const { ids } = this.stargazers.get(repoName)
    return ids.map(this.getUser)
  }

  getOwners(repos) {
    return repos.map(repo => this.getUser(repo.owner))
  }

  addUsers(newUsers) {
    this.users = this.users.merge(newUsers)
  }

  addRepos(newRepos) {
    this.repos = this.repos.merge(newRepos)
  }

  startStargazersFetching(repoName) {
    this.stargazers = this.stargazers.startFetching(repoName)
  }

  finishStargazersFetching(repoName) {
    this.stargazers = this.stargazers.finishFetching(repoName)
  }

  startStarrredFetching(repoName) {
    this.starredRepos = this.starredRepos.startFetching(repoName)
  }

  finishStarrredFetching(repoName) {
    this.starredRepos = this.starredRepos.finishFetching(repoName)
  }
}
