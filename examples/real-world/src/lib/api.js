import 'isomorphic-fetch'

const API_ROOT = 'https://api.github.com'

const getNextPageUrl = response => {
  const link = response.headers.get('link')
  if (!link) {
    return null
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)
  if (!nextLink) {
    return null
  }

  return nextLink.split(';')[0].slice(1, -1)
}

function fetchData(url) {
  return fetch(url)
    .then(response =>
      response.json().then(data => {
        if (!response.ok) {
          return Promise.reject(data)
        }
        const nextPageUrl = getNextPageUrl(response)
        return { data, nextPageUrl }
      })
    )
}

export const fetchUser = login =>
  fetchData(`${API_ROOT}/users/${login}`)

export const fetchStarred = (login, nextPageUrl) =>
  fetchData(nextPageUrl || `${API_ROOT}/users/${login}/starred`)

export const fetchRepo = fullName =>
  fetchData(`${API_ROOT}/repos/${fullName}`)

export const fetchStargazers = (fullName, nextPageUrl) =>
  fetchData(nextPageUrl || `${API_ROOT}/repos/${fullName}/stargazers`)
