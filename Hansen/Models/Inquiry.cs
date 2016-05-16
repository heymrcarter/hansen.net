using System.ComponentModel.DataAnnotations;

namespace Hansen.Models
{
    public class Inquiry
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(4)]
        public string VehicleYear { get; set; }

        [Required]
        public string VehicleModel { get; set; }

        [Required]
        public string VehicleMake { get; set; }

        public string AdditionalComments { get; set; }
    }
}