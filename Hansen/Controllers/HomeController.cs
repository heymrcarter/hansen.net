using Hansen.Helpers;
using System.Web.Mvc;

namespace Hansen.Controllers
{
    public class HomeController : Controller
    {
        private IGalleryHelper _galleryHelper;

        public HomeController()
        {

        }

        public HomeController(IGalleryHelper helper)
        {
            _galleryHelper = helper;
        }

        public ActionResult Index()
        {
            return View(_galleryHelper.GetGalleryImages());
        }
    }
}