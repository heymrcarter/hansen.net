﻿using System.Web;
using System.Web.Optimization;
using System.Web.Optimization.React;

namespace Hansen
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/foundation").Include(
                "~/Scripts/foundation/foundation.js",
                "~/Scripts/foundation/foundation.clearing.js",
                "~/Scripts/foundation/foundation.equalizer.js",
                "~/Scripts/foundation/foundation.magellan.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/Content/foundation/normalize.css",
                "~/Content/foundation/foundation.css",
                "~/Content/styles/hansen.css"
            ));

            bundles.Add(new ScriptBundle("~/bundles/lib").Include(
                "~/node_modules/react/dist/react.js",
                "~/node_modules/react-dom/dist/react-dom.js"
                ));

            bundles.Add(new BabelBundle("~/bundles/hansen").Include(
                "~/Scripts/components/Map.jsx",
                "~/Scripts/components/ContactForm.jsx"
                ));
        }
    }
}
