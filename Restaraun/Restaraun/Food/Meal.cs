using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food
{
    public class Meal : IFood
    {
        private List<IFood> _food=new List<IFood>();
        private string _name;
        private double _discount;

        public Meal(List<IFood> food, string name, double discount)
        {
            if (food.Count == 0)
            {
                Console.WriteLine("Вы не добавили товар в набор");
            }
                _food = food;
                _name = name;
                _discount = discount;
            
        }

        public string Name { get => _name; set => _name = value; }
        public double Discount { get => _discount; set => _discount = value; }

        public int calories()
        {
            int totalCalories = _food.Sum(f=>f.calories());
            return totalCalories;
        }

        public string name()
        {
            return _name;
        }

        public IPacking packing()
        {
            double packingPrice = _food.Sum(f => f.packing().packingPrice());
            return new MultiPack(packingPrice);
        }

        public double price()
        {
            double price = _food.Sum(f => f.price());
            return price;
        }
        public List<IFood> getFoodItems()
        {
            return _food;
        }
    }
}
