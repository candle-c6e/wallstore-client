import { useState, useEffect, FunctionComponent } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FiEdit, FiDelete } from "react-icons/fi";
import Layout from "../../components/Layout";
import { ResponseServer, TProduct } from "../../lib/types";
import Table, { DataTable, HeaderTable } from "../../components/Table";
import Badges from "../../components/Badges";

interface Props {
  products: TProduct[];
}

const ProductMange: FunctionComponent<Props> = ({ products }) => {
  const [dataTable, setDataTable] = useState(null);
  const [sortList, setSortList] = useState({});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    mapData();
  }, []);

  const sortTable = (header: string) => {
    const duplicateSortList = { ...sortList };

    if (header in duplicateSortList) {
      if (duplicateSortList[header] === "DESC") {
        duplicateSortList[header] = "ASC";
      } else {
        duplicateSortList[header] = "DESC";
      }
    } else {
      duplicateSortList[header] = "DESC";
    }

    const duplicateData = [...dataTable];

    const sortData = duplicateData.sort((a: any, b: any) => {
      if (sortList[header] === "DESC") {
        if (sortList[header] === "created" || sortList[header] == "updated") {
          return new Date(a[header]).getTime() > new Date(b[header]).getTime()
            ? -1
            : 1;
        } else {
          return a[header] > b[header] ? -1 : 1;
        }
      } else {
        if (sortList[header] === "created" || sortList[header] == "updated") {
          return new Date(a[header]).getTime() > new Date(b[header]).getTime()
            ? -1
            : 1;
        } else {
          return a[header] < b[header] ? -1 : 1;
        }
      }
    });

    setSortList(duplicateSortList);
    setDataTable(sortData);
  };

  const tableHeader: HeaderTable[] = [
    {
      headerName: "Image",
    },
    {
      headerName: "Product name",
      sort: () => sortTable("productName"),
    },
    {
      headerName: "Sale price <br /> Price",
      sort: () => sortTable("salePrice"),
    },
    {
      headerName: "Created at",
      sort: () => sortTable("created"),
    },
    {
      headerName: "Updated at",
      sort: () => sortTable("updated"),
    },
    {
      headerName: "Action",
    },
  ];

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are your want to delete?")) {
      const response = await fetch("https://jjams.co/api/wallstore/product", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const { error, msg }: ResponseServer = await response.json();

      if (error) {
        setError(true);
        setErrorMessage(msg);
      } else {
        window.location.reload();
      }
    }
  };

  const mapData = () => {
    const data: DataTable[] = products.map((item) => {
      return {
        image: `https://jjams.co/api/wallstore/uploads/product/${item.attributes.images[0].small}`,
        productName: item.productName,
        salePrice: `${item.salePrice} <br /> ${item.price}`,
        created: new Date(item.createdAt).toLocaleString(),
        updated: item.updatedAt
          ? new Date(item.updatedAt).toLocaleString()
          : "-",
        actions: [
          {
            render: (
              <Link href={`/wallstore/product/edit?productId=${item._id}`}>
                <a>
                  <span style={{ marginRight: "10px" }}>
                    <FiEdit color="orange" />
                  </span>
                </a>
              </Link>
            ),
          },
          {
            render: (
              <span style={{ cursor: "pointer" }}>
                <FiDelete color="red" onClick={() => handleDelete(item._id)} />
              </span>
            ),
          },
        ],
      };
    });

    setDataTable(data);
  };

  return (
    <Layout>
      <Badges isActive={error} type="danger">
        <span>{errorMessage}</span>
      </Badges>
      <div className="content-manage__wrapper wrapper">
        <div className="content-manage__header">
          <h3>Products</h3>
          <Link href="/wallstore/product/add">
            <a>
              <button>Add</button>
            </a>
          </Link>
        </div>
        <div className="table-wrapper">
          <Table headers={tableHeader} data={dataTable} />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const responseMe = await fetch("https://jjams.co/api/wallstore/me", {
    credentials: "include",
    headers: {
      Cookie: req.headers.cookie,
    },
  });
  const { error, result }: ResponseServer = await responseMe.json();

  if (error || result.roles !== "admin") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const response = await fetch("https://jjams.co/api/wallstore/products");
  const { result: products }: ResponseServer = await response.json();

  return {
    props: {
      products,
    },
  };
};

export default ProductMange;
