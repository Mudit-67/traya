
const fetchFilterPipeline = (filters) => {
  const page = parseInt(filters.page || 1);
  const limit = parseInt(filters.limit || 1000);
  const order_by = filters.order_by || "updatedAt";
  const order_direction = filters.order_direction || 'ASC';

  const $sort = {};
  $sort[order_by] =
    order_direction.toUpperCase() === 'ASC' ? 1 : -1;

  const $skip = (page - 1) * limit;
  const $limit = limit;

  const $project = { _id: 0, __v: 0 };

  const $facet = {
    records: [{ $skip }, { $limit }],
    pagination: [{ $count: "totalRecords" }],
  };

  return [{ $project }, { $sort }, { $facet } ];
};

module.exports = { fetchFilterPipeline };
