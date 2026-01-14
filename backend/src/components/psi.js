const {
  errorResponse,
  getCommonServiceData,
  logApiError,
} = require("./utils");
const HttpStatus = require("http-status-codes");
const config = require("../config/index");
const { createMoreFiltersSearchCriteria } = require("./psiFilters");

async function getPSIPaginated(req, res) {
  try {
    const search = [];
    if (req.query?.searchParams) {
      let criteriaArray = createMoreFiltersSearchCriteria(
        req.query.searchParams
      );
      criteriaArray.forEach((criteria) => {
        search.push(criteria);
      });
    }
    const params = {
      params: {
        pageNumber: req.query.pageNumber,
        pageSize: req.query.pageSize,
        sort: JSON.stringify(req.query.sort),
        searchCriteriaList: JSON.stringify(search),
      },
    };
    let data = await getCommonServiceData(
      `${config.get("server:psiSelectionAPIURL")}/api/v1/psi/paginated`,
      params
    );
    if (req?.query?.returnKey) {
      let result = data?.content.map(
        (record) => record[req?.query?.returnKey]
      );
      return res.status(HttpStatus.OK).json(result);
    }
    return res.status(200).json(data);
  } catch (e) {
    await logApiError(e, "Error getting PSI paginated list");
    if (e.data.message) {
      return errorResponse(res, e.data.message, e.status);
    } else {
      return errorResponse(res);
    }
  }
}

module.exports = {
  getPSIPaginated,
};
