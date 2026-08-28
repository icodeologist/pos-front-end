// Matching my backend go models
export interface Product {
  id: number;
  title: string;
  price: number;
  unit: string;
  taxRate: number;
  stockQuantity: number;
}
// there is no customer_Id tag so json marshals it has ID
export interface Customer {
  ID: number;
  name: string;
  phone_number: string;
  balance: number;
}

// FE-only cart line built while browsing products
export interface CartItem {
  productID: number;
  title: string;
  unit: string;
  price: number;
  quantity: number;
}


export interface CartLineInput {
  productID: number;
  unit: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerID: number | null;
  items: CartLineInput[];
}

export interface CheckoutPaymentRequest {
  paymentMethod: string;
  tenderedAmount: number;
  changeGiven: number;
  payPreviousCredit: boolean;
  payThroughCredit: boolean;
}

// NOTE: Order, OrderItem, and Payment structs have NO json tags at all,
// so every field name comes back capitalized. Confirm against a real
// /new-order response before trusting this.

export interface OrderItemResponse {
  ID: number;
  ProductId: number;
  OrderId: number;
  Quantity: number;
  PriceAtSale: number;
}

export interface OrderResponse {
  ID: number;
  CustomerID: number | null;
  TimeStamp: string;
  TotalAmount: number;
  PaymentMethod: string;
  PaymentBalance: number;
  Status: string;
  OrderItems: OrderItemResponse[];
}

export interface PaymentResponse {
  ID: number;
  OrderID: number;
  AmountTendered: number;
  ChangeGiven: number;
  Method: string;
  TimeStamp: string;
  PaymentThroughCredit: boolean;
}
