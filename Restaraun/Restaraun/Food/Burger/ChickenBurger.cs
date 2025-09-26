using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Burger
{
    public class ChickenBurger:Burger
    {
        public override int calories()
        {
            return 300;

        }
        public override string name()
        {
            return "ChickenBurger";
        }
        public override double price()
        {
            return 4.5d;
        }
    }
}
