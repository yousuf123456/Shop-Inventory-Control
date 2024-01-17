interface getPaginationQueriesProps {
  serverSort: null | { [key: string]: -1 | 1 };
  tieBreaker: null | string;
  cursor: string | null;
  goingNext: boolean;
}

export const getPaginationQueries = ({
  cursor,
  goingNext,
  serverSort,
  tieBreaker,
}: getPaginationQueriesProps) => {
  const serverSortField = serverSort ? Object.keys(serverSort)[0] : null;
  const serverSortValue = serverSort
    ? serverSort[Object.keys(serverSort)[0]]
    : null;

  const initialSortStage =
    serverSort !== null
      ? {
          $sort: {
            [serverSortField!]:
              serverSortValue! * (goingNext === null ? 1 : !goingNext ? -1 : 1),
            _id:
              serverSortValue! * (goingNext === null ? 1 : !goingNext ? -1 : 1),
          },
        }
      : goingNext === null || goingNext
      ? null
      : {
          $sort: {
            _id: -1,
          },
        };

  const finalSortStage =
    goingNext === null || goingNext
      ? null
      : serverSort !== null
      ? {
          $sort: {
            [Object.keys(serverSort)[0]]:
              serverSort[Object.keys(serverSort)[0]],
          },
        }
      : {
          $sort: {
            _id: 1,
          },
        };

  let greaterOrLess = goingNext ? "$gt" : "$lt";
  if (serverSortValue === -1)
    greaterOrLess === "$gt" ? (greaterOrLess = "$lt") : (greaterOrLess = "$gt");

  const matchQueries =
    cursor && goingNext !== null
      ? serverSort !== null
        ? {
            $or: [
              { [serverSortField!]: { [greaterOrLess]: cursor } },
              {
                [serverSortField!]: cursor,
                _id: { [greaterOrLess]: { $oid: tieBreaker } },
              },
            ],
          }
        : {
            _id: { [goingNext ? "$gt" : "$lt"]: { $oid: cursor } },
          }
      : null;
  try {
    //@ts-ignore
    console.log(matchQueries.$or);
  } catch {
    console.log("Not Now");
  }
  return {
    matchQueries,
    finalSortStage,
    initialSortStage,
  };
};
