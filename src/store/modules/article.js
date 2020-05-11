import {
  apiGetArticleSummary,
  apiGetArticleTotal,
  apiGetArticleDetails,
  apiDeleteArticle
} from '../../api/article'

const entityArticle = {
  state: {
    entityArticleList: null,
    entityArticleDetails: null
  },
  mutations: {
    SET_ENTITY_ARTICLE_LIST: (state, articleList) => {
      state.entityArticleList = articleList
    },
    SET_ENTITY_ARTICLE_DETAILS: (state, articleDetails) => {
      state.entityArticleDetails = articleDetails
    }
  },
  actions: {
    getArticleList({ commit }, params) {
      apiGetArticleSummary(params.category, params.currentPage, params.pageSize).then((articleList) => {
        commit('SET_ENTITY_ARTICLE_LIST', articleList)
      })
    },
    getSingleArticle({ commit }, artId) {
      apiGetArticleDetails(artId).then(articleDetails => {
        commit('SET_ENTITY_ARTICLE_DETAILS', articleDetails)
      })
    },
    deleteArticle({ commit }, artId) {
      return new Promise(function(resolve, reject) {
        apiDeleteArticle(artId).then(res => {
          resolve(res)
        }).catch(err => {
          console.log(err);
          reject(err)
        })
      })
    }
  }
}

export default entityArticle
