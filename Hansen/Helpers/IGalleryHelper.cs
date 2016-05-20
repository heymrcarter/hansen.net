using Hansen.Models;
using System.Collections.Generic;

namespace Hansen.Helpers
{
    public interface IGalleryHelper
    {
        IEnumerable<GalleryImage> GetGalleryImages();
    }
}