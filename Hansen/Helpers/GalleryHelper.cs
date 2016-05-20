using Hansen.Models;
using System.Collections.Generic;
using System.Web.Configuration;

namespace Hansen.Helpers
{
    public class GalleryHelper : IGalleryHelper
    {
        private IEnumerable<GalleryImage> _images;

        public GalleryHelper()
        {
            var thumbDir = WebConfigurationManager.AppSettings["GalleryThumbnailDirectory"];
            var fullDir = WebConfigurationManager.AppSettings["GalleryFullDirectory"];
            var numImgs = ConfigHelper.GetSetting<int>("NumberGalleryImages");

            var images = new List<GalleryImage>();

            for(var i = 0; i < numImgs; i++)
            {
                var image = new GalleryImage
                {
                    Thumbnail = string.Format(@"{0}\{1}.jpg", thumbDir, i+1),
                    Full = string.Format(@"{0}\{1}.jpg", fullDir, i+1)
                };

                images.Add(image);
            }

            _images = images;
        }

        public IEnumerable<GalleryImage> GetGalleryImages()
        {
            return _images;
        }
    }
}