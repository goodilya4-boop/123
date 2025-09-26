using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Nagets
{
    public class ChickenNuggets : Class1
    {
        public override int calories()
        {
            return 450;
        }

        public override string name()
        {
            return "Chiken Nuggets";
        }

        public override double price()
        {
            return 5.0d;
        }
    }
}
