using Restaraun.Food;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun
{
    public class Order
    {
        public enum OrderService
        {
            In,
            Out
        }
        private List<IFood> _food = new List<IFood>();
        private string customerName;
        private OrderService service;

        public Order(List<IFood> food, string customerName, OrderService service) {
            if (food.Count <= 0 || customerName == null || service == null) {
                Console.WriteLine("невозможно оформить такой заказ");
            }
            else
            {
                Food = food;
                this.CustomerName = customerName;
                this.Service = service;
            }
        }

        public List<IFood> Food { get => _food; set => _food = value; }
        public string CustomerName { get => customerName; set => customerName = value; }
        public OrderService Service { get => service; set => service = value; }
    }
}
