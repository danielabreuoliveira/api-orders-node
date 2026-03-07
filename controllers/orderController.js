// Importa o model responsável por acessar o banco de dados PostgreSQL
const orderModel = require("../models/orderModel");

/**
 * Cria um novo pedido realizando o de-para (mapping) dos campos
 */
async function createOrder(req, res) {
  try {
    // req.body contém o JSON enviado pelo cliente (Postman, frontend, etc.)
    const payload = req.body;

    // --- MAPPING DO PEDIDO (BASE) ---
    // Traduzimos os nomes das chaves do JSON para as variáveis que o Model espera
    const orderid = payload.numeroPedido;     // numeroPedido -> orderid
    const value = payload.valorTotal;         // valorTotal   -> value
    const creationdate = payload.dataCriacao; // dataCriacao  -> creationdate

    // --- MAPPING DOS ITENS (ARRAY) ---
    // Percorre a lista de itens recebida no JSON e transforma cada objeto 
    // para o formato de colunas da tabela 'items'
    const items = payload.items.map(item => ({
      productid: item.idItem,           // idItem         -> productid
      quantity: item.quantidadeItem,    // quantidadeItem -> quantity
      price: item.valorItem             // valorItem      -> price
    }));

    // Envia os dados já mapeados para a função de persistência no Model
    const result = await orderModel.createOrder(
      orderid,
      value,
      creationdate,
      items
    );

    // Retorna resposta HTTP 201 (Created) com o objeto criado no banco
    res.status(201).json(result);

  } catch (error) {
    // Caso ocorra erro (ex: banco fora do ar, erro de sintaxe), imprime no console
    console.error("Erro ao criar o pedido:", error);
    // Retorna erro 500 (Internal Server Error) para o cliente
    res.status(500).json({ error: "Erro ao criar o pedido" });
  }
}

/**
 * Lista todos os pedidos cadastrados
 */
async function getOrders(req, res) {
  try {
    // Solicita ao model a lista completa de pedidos
    const orders = await orderModel.getOrders();

    // Retorna a lista em formato JSON (Status 200 é o padrão)
    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar os pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar os pedidos" });
  }
}

/**
 * Busca os detalhes de um único pedido através do ID na URL
 */
async function getOrderById(req, res) {
  try {
    // Extrai o ID dos parâmetros da rota (ex: /orders/:id)
    const { id } = req.params;

    // Chama o model para buscar o registro específico
    const order = await orderModel.getOrderById(id);

    // Se o banco retornar vazio, encerra com status 404 (Not Found)
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    // Retorna o objeto do pedido encontrado
    res.json(order);
  } catch (error) {
    console.error("Erro ao buscar o pedido:", error);
    res.status(500).json({ error: "Erro ao buscar o pedido" });
  }
}

/**
 * Atualiza campos específicos do pedido (ex: valorTotal)
 */
async function updateOrder(req, res) {
  try {
    // Pega o ID da URL para saber qual pedido atualizar
    const { id } = req.params; 

    // MAPPING: Extrai 'valorTotal' do body e renomeia para 'value' em uma única linha
    const { valorTotal: value } = req.body; 

    // Validação: Impede que a atualização prossiga sem um valor definido
    if (value === undefined) {
      return res.status(400).json({ 
        error: "Campo 'valorTotal' não encontrado no corpo da requisição." 
      });
    }

    // Executa a query de UPDATE via Model
    const updatedOrder = await orderModel.updateOrder(id, value);
    
    // Se o ID enviado não existir no banco, retorna 404
    if (!updatedOrder) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Retorna o registro atualizado para o cliente conferir
    res.json(updatedOrder);

  } catch (error) {
    console.error("Erro ao atualizar:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}

/**
 * Remove um pedido e seus itens do banco de dados
 */
async function deleteOrder(req, res) {
  try {
    // Identifica o pedido pelo ID da URL
    const { id } = req.params;

    // O model deve tratar a exclusão em cascata (itens primeiro, depois pedido)
    const result = await orderModel.deleteOrder(id);

    // Retorna a confirmação de exclusão
    res.json(result);
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error deleting order" });
  }
}

// Exporta o conjunto de funções para serem vinculadas às rotas no arquivo de roteamento
module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
};