// Importa o model responsável por acessar o banco de dados
const orderModel = require("../models/orderModel");

// Função responsável por criar um pedido
async function createOrder(req, res) {

  try {

    // req.body contém o JSON enviado pelo cliente (Postman, frontend, etc.)
    const payload = req.body;

    // Mapping do pedido
    // Aqui transformamos os nomes dos campos do JSON recebido
    // para os nomes usados no banco de dados
    const orderid = payload.numeroPedido;
    const value = payload.valorTotal;
    const creationdate = payload.dataCriacao;

    // Mapping dos itens
    // Percorre a lista de itens recebida no JSON
    // e transforma os nomes para o formato do banco
    const items = payload.items.map(item => ({
      productid: item.idItem,           // id do produto
      quantity: item.quantidadeItem,    // quantidade
      price: item.valorItem             // valor do item
    }));

    // Chama a função do model para salvar o pedido no banco
    const result = await orderModel.createOrder(
      orderid,
      value,
      creationdate,
      items
    );

    // Retorna resposta HTTP 201 (Created) com o pedido criado
    res.status(201).json(result);

  } catch (error) {

    // Caso ocorra erro, imprime no console do servidor
    console.error("Erro ao criar o pedido:", error);

    // Retorna erro 500 para o client
    res.status(500).json({ error: "Erro ao criar o pedido" });

  }

}

// Função responsável por listar todos os pedidos
async function getOrders(req, res) {

  try {

    // Chama o model para buscar todos os pedidos
    const orders = await orderModel.getOrders();

    // Retorna os pedidos em formato JSON
    res.json(orders);

  } catch (error) {

    // Log de erro no servidor
    console.error("Erro ao buscar os pedidos:", error);

    // Retorna erro para o cliente
    res.status(500).json({ error: "Erro ao buscar os pedidos" });

  }

}

// Função responsável por buscar um pedido específico pelo ID
async function getOrderById(req, res) {
  try {

    // Pega o id enviado na URL
    // Exemplo: /order/123
    const { id } = req.params;

    // Busca o pedido no banco
    const order = await orderModel.getOrderById(id);

    // Se não encontrar o pedido retorna erro 404
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Retorna o pedido encontrado
    res.json(order);

  } catch (error) {

    // Log do erro
    console.error("Erro ao buscar o pedido:", error);

    // Retorna erro 500
    res.status(500).json({ error: "Erro ao buscar o pedido" });

  }
}

// Função responsável por atualizar um pedido
async function updateOrder(req, res) {
  try {

    // Pega o id do pedido na URL
    const { id } = req.params;

    // Pega o novo valor enviado no body
    const { value } = req.body;

    // Chama o model para atualizar o pedido
    const order = await orderModel.updateOrder(id, value);

    // Retorna o pedido atualizado
    res.json(order);

  } catch (error) {

    // Log de erro
    console.error("Erro ao atualizar o pedido:", error);

    // Retorna erro 500
    res.status(500).json({ error: "Erro ao atualizar o pedido" });

  }
}

// Função responsável por deletar um pedido
async function deleteOrder(req, res) {
  try {

    // Pega o id do pedido na URL
    const { id } = req.params;

    // Chama o model para excluir o pedido
    const result = await orderModel.deleteOrder(id);

    // Retorna mensagem de sucesso
    res.json(result);

  } catch (error) {

    // Log de erro
    console.error("Error deleting order:", error);

    // Retorna erro 500
    res.status(500).json({ error: "Error deleting order" });

  }
}

// Exporta as funções para serem usadas nas rotas da aplicação
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};