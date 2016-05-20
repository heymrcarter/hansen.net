using Autofac;
using Autofac.Integration.Mvc;
using Hansen.Helpers;
using System.Web.Mvc;

namespace Hansen
{
    public static class AutofacConfig
    {
        public static void RegisterTypes()
        {
            var builder = new ContainerBuilder();

            builder.RegisterControllers(typeof(MvcApplication).Assembly);

            var galleryHelper = new GalleryHelper();
            builder.RegisterInstance(galleryHelper).As<IGalleryHelper>();

            var container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}