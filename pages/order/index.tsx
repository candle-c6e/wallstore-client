import { FunctionComponent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { AiFillEye } from "react-icons/ai";
import { NextSeo } from "next-seo";
import Table, { DataTable, HeaderTable } from "../../components/Table";
import { TOrderDetail, ResponseServer, TCart } from "../../lib/types";
import Layout from "../../components/Layout";
import styles from "../../styles/Order.module.css";

interface Props {
  orders: TOrderDetail[];
}

const Order: FunctionComponent<Props> = ({ orders }) => {
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    mapData();
  }, []);

  const tableHeader: HeaderTable[] = [
    {
      headerName: "Order id",
    },
    {
      headerName: "Quantity",
    },
    {
      headerName: "Total",
    },
    {
      headerName: "Created at",
    },
    {
      headerName: "",
    },
  ];

  const mapData = () => {
    const data: DataTable[] = orders.map((item) => {
      return {
        orderId: item.orderId,
        quantity: item.quantity,
        total: `$${item.total}`,
        created: new Date(item.createdAt).toLocaleString(),
        actions: [
          {
            render: (
              <Link
                href={`${process.env.NEXT_PUBLIC_BASEURL}/order/${item.orderId}`}
              >
                <a>
                  <AiFillEye color="orange" size={20} />
                </a>
              </Link>
            ),
          },
        ],
      };
    });

    setDataTable(data);
  };

  return (
    <Layout>
      <NextSeo
        title="order | wallstore"
        description="wallstore ecommerce this site power by nextjs"
      />
      <div className={`${styles.orderWrapper} wrapper`}>
        <h2>Order</h2>
        {orders && orders.length ? (
          <div className="table-wrapper">
            <Table headers={tableHeader} data={dataTable} />
          </div>
        ) : (
          <h4 style={{ marginTop: "5rem" }}>Order is empty</h4>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const responseMe = await fetch(`${process.env.NEXT_PUBLIC_BASEURL_API}/me`, {
    credentials: "include",
    headers: {
      Cookie: req.headers.cookie,
    },
  });
  const { error }: ResponseServer = await responseMe.json();

  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASEURL_API}/order-user`,
    {
      credentials: "include",
      headers: {
        Cookie: req.headers.cookie,
      },
    }
  );
  const { result }: ResponseServer = await response.json();

  return {
    props: {
      orders: result,
    },
  };
};

export default Order;
