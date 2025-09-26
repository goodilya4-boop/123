using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Restaraun.Food;
using static Restaraun.Order;
namespace Restaraun
{
    public class BillPrinter
    {
        public BillPrinter() { }
        public void printItemsedBill(Order order)
        {
            float cost = 0;
            double totalPrice = 0;
            double discount = 0;
            double totalCost = 0;
            OrderService service = order.Service;
            Console.WriteLine(string.Format("{0}", service==0?"Вас ждёт столик":"Заказ гтов для выноса"));
            Console.WriteLine(order.CustomerName);
            Console.WriteLine(string.Format("|{0,25}|\t{1,20}|\t{2,20}|\t{3,20}|\t{4,15}|\n", "Food Item","Calories","Packing","Packing price","Discount","Total price"));
            foreach(var item in order.Food)
            {
                if(item is Meal)
                {
                    discount = (item as Meal).Discount;
                    totalPrice = (item as Meal).price();
                }
                else
                {
                    discount = 0.0d;
                    //добавить к стоимости товара упаковку
                    totalPrice = Math.Round(item.price()+item.packing().packingPrice(),2);
                }
                Console.WriteLine(string.Format("|{0,25}|\t{1,20}|\t{2,20}|\t{3,20}|\t{4,15}|\n", item.name(), item.calories(), item.price(),discount,totalPrice));
                totalCost += totalPrice;
            }
            Console.WriteLine("------------------------------------------------------------------------------------------------------------------------\n");
            Console.WriteLine("Общий счёт: {0}, не забудьте про чаевые *ПЛАТИ (-_-)*", Math.Round(TotalCost(totalCost,service),2));
        }


        private double TotalCost(double totalCost,OrderService orderService)
        {
            return totalCost+(totalCost*(orderService==0?0.8:0.1));
        }

        
    }
}
