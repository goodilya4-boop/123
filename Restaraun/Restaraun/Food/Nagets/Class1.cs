using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Nagets
{
    public abstract class Class1 : IFood
    {
        public abstract int calories();

        public abstract string name();

        public IPacking packing()
        {
            return new Container();
        }

        public abstract double price();
    }
}
