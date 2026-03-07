// Importa a conexão com o banco PostgreSQL
const pool = require("../db/connection"); 

// Função responsável por criar um pedido e seus itens
async function createOrder(orderid, value, creationdate, items) {

  // Pega uma conexão do pool de conexões
  const client = await pool.connect();

  try {

    // Inicia uma transação no banco
    // Isso garante que todas as operações sejam executadas juntas
    await client.query("BEGIN");

    // Insere o pedido na tabela orders
    // RETURNING * retorna o registro inserido
    const orderResult = await client.query(
      "INSERT INTO orders(orderid, value, creationdate) VALUES($1,$2,$3) RETURNING *",
      [orderid, value, creationdate]
    );

    // Verifica se existem itens no pedido
    if (items && items.length > 0) {

      // Percorre todos os itens enviados no pedido
      for (const item of items) {

        // Insere cada item na tabela items
        await client.query(
          "INSERT INTO items(orderid, productid, quantity, price) VALUES($1,$2,$3,$4)",
          [
            orderid,           // id do pedido
            item.productid,    // id do produto
            item.quantity,     // quantidade do produto
            item.price         // valor do produto
          ]
        );

      }

    }

    // Confirma a transação (salva tudo no banco)
    await client.query("COMMIT");

    // Retorna o pedido criado
    return orderResult.rows[0];

  } catch (error) {

    // Se ocorrer algum erro, desfaz todas as operações da transação
    await client.query("ROLLBACK");
    throw error;

  } finally {

    // Libera a conexão de volta para o pool
    client.release();

  }

}

async function getOrderById(orderid) {
  try {
    // 1. Busca os dados principais do pedido
    const orderResult = await pool.query(
      "SELECT * FROM orders WHERE orderid = $1",
      [orderid]
    );

    // Se não encontrar o pedido, retorna null
    if (orderResult.rows.length === 0) {
      return null;
    }

    const order = orderResult.rows[0];

    // 2. Busca os itens que pertencem a esse pedido específico
    const itemsResult = await pool.query(
      "SELECT productid, quantity, price FROM items WHERE orderid = $1",
      [orderid]
    );

    // 3. Adiciona o array de itens ao objeto do pedido
    order.items = itemsResult.rows;

    return order;
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error);
    throw error;
  }
}

async function getOrders() {

  const ordersResult = await pool.query(
    "SELECT * FROM orders ORDER BY creationdate DESC"
  );

  const orders = ordersResult.rows;

  for (const order of orders) {

    const itemsResult = await pool.query(
      "SELECT productid, quantity, price FROM items WHERE orderid = $1",
      [order.orderid]
    );

    order.items = itemsResult.rows;

  }

  return orders;
}

// Função responsável por atualizar o valor de um pedido
async function updateOrder(id, value) {

  // Atualiza o valor do pedido baseado no orderid
  const result = await pool.query(
    "UPDATE orders SET value = $1 WHERE orderid = $2 RETURNING *",
    [value, id]
  );

  // Retorna o pedido atualizado
  return result.rows[0];

}

// Função responsável por deletar um pedido
async function deleteOrder(orderid) {

  // Obtém uma conexão do pool
  const client = await pool.connect();

  try {

    // Inicia uma transação
    await client.query("BEGIN");

    // Primeiro remove os itens associados ao pedido
    // Isso evita erro de chave estrangeira (foreign key)
    await client.query(
      "DELETE FROM items WHERE orderid = $1",
      [orderid]
    );

    // Depois remove o pedido da tabela orders
    await client.query(
      "DELETE FROM orders WHERE orderid = $1",
      [orderid]
    );

    // Confirma a transação
    await client.query("COMMIT");

    // Retorna mensagem de sucesso
    return { message: "Pedido deletado com sucesso" };

  } catch (error) {

    // Se houver erro, desfaz as alterações
    await client.query("ROLLBACK");
    throw error;

  } finally {

    // Libera a conexão
    client.release();

  }

}

// Exporta as funções para serem usadas no controller
module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrderById
};