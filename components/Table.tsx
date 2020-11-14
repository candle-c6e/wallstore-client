import { Fragment, FunctionComponent, useEffect, useState } from "react";

export interface HeaderTable {
  headerName: string | JSX.Element;
  sort?: any;
}

interface Actions {
  render: JSX.Element;
  style?: {};
}

export interface DataTable {
  actions?: Actions[];
  [key: string]: any;
}

interface Table {
  headers: HeaderTable[] | null;
  data: DataTable[] | null;
  footer?: JSX.Element;
}

const Table: FunctionComponent<Table> = ({ headers, data, footer }) => {
  const [dataTable, setDataTable] = useState<DataTable[]>(null);

  useEffect(() => {
    setDataTable(data);
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((item, index) => {
            return (
              <td
                key={index}
                onClick={item.sort}
                style={{
                  cursor: item.sort ? "pointer" : null,
                  minWidth: "150px",
                }}
              >
                {typeof item.headerName === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: item.headerName }} />
                ) : (
                  <div>{item.headerName}</div>
                )}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataTable &&
          dataTable.map((item, index) => (
            <tr key={index}>
              {Object.entries(item).map(([key, value], index) => {
                if (key === "actions") {
                  return (
                    <td key={index}>
                      {value.map((action: any, index: number) => {
                        return <Fragment key={index}>{action.render}</Fragment>;
                      })}
                    </td>
                  );
                } else if (key === "image") {
                  return (
                    <td key={index}>
                      <img
                        style={{ borderRadius: "50%" }}
                        src={value}
                        width="40"
                        height="40"
                      />
                    </td>
                  );
                } else if (typeof value === "string") {
                  return (
                    <td key={index}>
                      <div dangerouslySetInnerHTML={{ __html: value }} />
                    </td>
                  );
                } else {
                  return (
                    <td key={index}>
                      <div>{value}</div>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
      </tbody>
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  );
};

export default Table;
