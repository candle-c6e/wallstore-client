import { useState, useEffect, FunctionComponent } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { FiEdit, FiDelete } from "react-icons/fi";
import Layout from "../../components/Layout";
import { Category, ResponseServer } from "../../lib/types";
import Table, { DataTable, HeaderTable } from "../../components/Table";
import Badges from "../../components/Badges";

interface Props {
  categories: Category[];
}

const tableHeader: HeaderTable[] = [
  {
    headerName: "Image",
  },
  {
    headerName: "Category name",
  },
  {
    headerName: "Created at",
  },
  {
    headerName: "Updated at",
  },
  {
    headerName: "Action",
  },
];

const CategoryMange: FunctionComponent<Props> = ({ categories }) => {
  const [dataTable, setDataTable] = useState(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    mapData();
  }, []);

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are your want to delete?")) {
      const response = await fetch("https://jjams.co/api/wallstore/category", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),
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
    const data: DataTable[] = categories.map((item) => {
      return {
        image: `https://jjams.co/api/wallstore/uploads/category/${item.images[0].small}`,
        data: item.categoryName,
        created: new Date(item.createdAt).toLocaleString(),
        updated: item.updatedAt
          ? new Date(item.updatedAt).toLocaleString()
          : "-",
        actions: [
          {
            render: (
              <Link href={`/wallstore/category/edit?categoryId=${item._id}`}>
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
          <h3>Category</h3>
          <Link href="/wallstore/category/add">
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

  const response = await fetch("https://jjams.co/api/wallstore/categories");
  const { result: categories }: ResponseServer = await response.json();

  return {
    props: {
      categories,
    },
  };
};

export default CategoryMange;
