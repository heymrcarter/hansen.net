using System;
using System.ComponentModel;
using System.Configuration;

namespace Hansen.Helpers
{
    public static class ConfigHelper
    {
        public static T GetSetting<T> (string key)
        {
            var setting = ConfigurationManager.AppSettings[key];

            if (string.IsNullOrWhiteSpace(setting))
            {
                throw new Exception(string.Format("Setting with key: {0} not found.", key));
            }

            var converter = TypeDescriptor.GetConverter(typeof(T));
            return (T)(converter.ConvertFromInvariantString(setting));
        }
    }
}