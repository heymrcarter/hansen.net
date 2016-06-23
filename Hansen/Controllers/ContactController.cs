using Hansen.Helpers;
using Hansen.Models;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace Hansen.Controllers
{
    public class ContactController : Controller
    {
        private IRestClient _client;

        public ContactController()
        {
            var apiKey = WebConfigurationManager.AppSettings["MailgunAPIKey"];

            _client = new RestClient
            {
                BaseUrl = new Uri("https://api.mailgun.net/v3"),
                Authenticator = new HttpBasicAuthenticator("api", apiKey)
            };
        }

        [HttpPost]
        public void Index(Inquiry inquiry)
        {
            var shouldSendMail = !ConfigHelper.GetSetting<bool>("MailgunDebugMode");

            if (ModelState.IsValid && shouldSendMail)
            {
                SendConfirmation(inquiry);
                SendInquiryAlert(inquiry);
            }
            
        }

        private IRestResponse SendConfirmation(Inquiry inquiry)
        {
            var message = new Message
            {
                From = WebConfigurationManager.AppSettings["Sender"],
                To = inquiry.Email,
                Subject = WebConfigurationManager.AppSettings["ConfirmationSubject"],
                Contents = string.Format(WebConfigurationManager.AppSettings["ConfirmationBody"], inquiry.VehicleYear, inquiry.VehicleMake, inquiry.VehicleModel)
            };

            return SendMessage(message);
        }

        private IRestResponse SendInquiryAlert(Inquiry inquiry)
        {
            var message = new Message
            {
                From = WebConfigurationManager.AppSettings["Sender"],
                To = WebConfigurationManager.AppSettings["AlertRecipiant"],
                Subject = string.Format(WebConfigurationManager.AppSettings["AlertSubject"], inquiry.Name),
                Contents = string.Format(WebConfigurationManager.AppSettings["AlertBody"], inquiry.Name, inquiry.Phone, inquiry.Email, inquiry.VehicleYear, inquiry.VehicleMake, inquiry.VehicleModel, inquiry.AdditionalComments)
            };

            return SendMessage(message);
        }

        private IRestResponse SendMessage (Message message)
        {
            var request = new RestRequest
            {
                Resource = "{domain}/messages",
                Method = Method.POST
            };

            request.AddParameter("domain", WebConfigurationManager.AppSettings["MailgunDomain"], ParameterType.UrlSegment);
            request.AddParameter("from", message.From);
            request.AddParameter("to", message.To);
            request.AddParameter("subject", message.Subject);
            request.AddParameter("text", message.Contents);

            return _client.Execute(request);
        }
    }
}