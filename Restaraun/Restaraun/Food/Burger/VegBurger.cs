using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Burger
{
    public class VegBurger:Burger
    {
        public override int calories()
        {
            return 300;

        }
        public override string name()
        {
            return "Vegan Burger";
        }
        public override double price()
        {
            throw new NotImplementedException();
        }
    }
}
