import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TOrderDetail, ResponseServer } from "../../lib/types";
import Layout from "../../components/Layout";
import Table, { DataTable, HeaderTable } from "../../components/Table";
import styles from "../../styles/OrderDetail.module.css";
import { GetServerSideProps } from "next";

const OrderDetail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<TOrderDetail | null>(null);
  const [dataTable, setDataTable] = useState(null);

  useEffect(() => {
    setLoading(true);
    if ("id" in router.query) {
      fetchOrder();
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    mapData();
  }, [order]);

  const fetchOrder = async () => {
    const response = await fetch("https://jjams.co/api/wallstore/order-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ orderId: router.query.id }),
    });
    const result: ResponseServer = await response.json();

    if (!result.error) {
      setOrder(result.result[0]);
    }
  };

  const tableHeader: HeaderTable[] = [
    {
      headerName: "Image",
    },
    {
      headerName: "Product name",
    },
    {
      headerName: "Attributes",
    },
    {
      headerName: "Quantity",
    },
    {
      headerName: "Sale price",
    },
  ];

  const tableFooter: JSX.Element = (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>{order && order.totalQuantity}</td>
      <td>${order && order.total}</td>
    </tr>
  );

  const mapData = () => {
    const data: DataTable =
      order &&
      order.products.map((item) => {
        return {
          image: `https://jjams.co/api/wallstore/uploads/product/${item.productImage}`,
          productName: item.productName,
          attributes: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.size}
              <div
                style={{
                  backgroundColor: item.color,
                  border: "1px solid green",
                  borderRadius: "50%",
                  marginLeft: "1rem",
                  height: "20px",
                  width: "20px",
                }}
              />
            </div>
          ),
          quantity: item.quantity,
          salePrice: `$${item.salePrice}`,
        };
      });

    setDataTable(data);
  };

  if (loading) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`${styles.orderDetailWrapper} wrapper`}>
        <h2>Order</h2>
        <div className="table-wrapper">
          <Table headers={tableHeader} data={dataTable} footer={tableFooter} />
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
  const { error }: ResponseServer = await responseMe.json();

  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
};

export default OrderDetail;
