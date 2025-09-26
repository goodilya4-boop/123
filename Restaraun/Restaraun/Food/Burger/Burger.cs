using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Burger
{
    public abstract class Burger : IFood
    {
        public abstract int calories();

        public abstract string name();
        

        public IPacking packing()
        {
            return new Wrap();
        }

        public abstract double price();
        }
    }

