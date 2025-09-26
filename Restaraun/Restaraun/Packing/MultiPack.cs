using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Packing
{
    public class MultiPack:IPacking
    {
        private double _packingPrice;
        
        public MultiPack(double packingPrice)
        {
            this._packingPrice = packingPrice;
        }
        public string pack()
        {
            return "MultiPack";
        }

        public double packingPrice()
        {
            return _packingPrice;
        }
    }
}
