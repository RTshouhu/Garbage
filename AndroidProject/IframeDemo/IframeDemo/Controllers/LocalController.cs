using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using TC.InterVacation.Autotrophy.Common;
using TC.InterVacation.DalLibrary;

namespace IframeDemo.Controllers
{
    public class LocalController : Controller
    {
        public ActionResult Local()
        {
            System.Timers.Timer t = new System.Timers.Timer(10000);
            t.Elapsed += new System.Timers.ElapsedEventHandler(theout);
            t.AutoReset = true;//设置是执行一次（false）还是一直执行(true)；
            t.Enabled = true;//是否执行System.Timers.Timer.Elapsed事件；

            return View();
        }       
        public ActionResult LocalProxy()
        {
            DataTable hh = new DataTable();
            return View(hh);
        }

        public void theout(object source, System.Timers.ElapsedEventArgs e)
        {
            
        } 
    }    

    #region 测试虚方法
    public class TestVirtualClass
    {
        public int ID{get;set;}

        public virtual void SetValue()
        {
            ID = 1;
        }

        public void SetValue(int i)
        {
            ID = i;
        }
    }
    #endregion
}
