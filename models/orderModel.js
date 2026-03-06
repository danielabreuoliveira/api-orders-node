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

// Função responsável por listar todos os pedidos
async function getOrders() {

  // Executa uma consulta que retorna todos os pedidos
  // Ordenados pela data de criação (mais recente primeiro)
  const result = await pool.query(
    "SELECT * FROM orders ORDER BY creationdate DESC"
  );

  // Retorna a lista de pedidos
  return result.rows;

}

// Função responsável por buscar um pedido específico pelo ID
async function getOrderById(id) {

  // Busca o pedido na tabela orders
  const order = await pool.query(
    "SELECT * FROM orders WHERE orderid = $1",
    [id]
  );

  // Busca os itens associados ao pedido
  const items = await pool.query(
    "SELECT productid, quantity, price FROM items WHERE orderid = $1",
    [id]
  );

  // Retorna o pedido junto com os itens
  return {
    order: order.rows[0],
    items: items.rows
  };

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
    return { message: "Ordem deletada com sucesso" };

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
  getOrderById,
  updateOrder,
  deleteOrder,
};