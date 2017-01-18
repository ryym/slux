import * as api from '../../lib/api'
import {
  normalizeKey,
  normalizeUser,
  normalizeUsers,
  normalizeRepo,
  normalizeRepos,
} from './normalizers'

function fetchAndNormalize(requestPromise, normalize) {
  return requestPromise.then(({ data, nextPageUrl }) => {
    return Object.assign({}, normalize(data), { nextPageUrl })
  })
}

export const fetchUser = login => {
  return fetchAndNormalize(api.fetchUser(login), normalizeUser)
}

export const fetchRepo = fullName => {
  return fetchAndNormalize(api.fetchRepo(fullName), normalizeRepo)
}

export const fetchStarred = (login, nextPageUrl) => {
  return fetchAndNormalize(api.fetchStarred(login, nextPageUrl), normalizeRepos)
}

export const fetchStargazers = (fullName, nextPageUrl) => {
  return fetchAndNormalize(api.fetchStargazers(fullName, nextPageUrl), normalizeUsers)
}
