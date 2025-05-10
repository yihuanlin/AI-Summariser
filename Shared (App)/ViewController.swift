import WebKit

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.yhl.summariser.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

#if os(iOS)
        // Disable scrolling for iOS
        self.webView.scrollView.isScrollEnabled = false
        
        // Set the webView to extend edges under the navigation bar
        if #available(iOS 11.0, *) {
            webView.scrollView.contentInsetAdjustmentBehavior = .never
        }
#elseif os(macOS)
        // Configure main view
        self.view.wantsLayer = true
        self.view.layer?.backgroundColor = NSColor.clear.cgColor
        
        // Make WebView background transparent
        webView.setValue(false, forKey: "drawsBackground")
#endif

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }
    
#if os(macOS)
    override func viewDidAppear() {
        super.viewDidAppear()
        
        if let window = self.view.window {
            // Configure window appearance for transparency
            window.titlebarAppearsTransparent = true
            window.titleVisibility = .hidden
            window.styleMask.insert(.fullSizeContentView)
            
            // Make window background transparent
            window.isOpaque = false
            window.backgroundColor = NSColor.clear
            window.hasShadow = true
            
            // Apply visual effect to the window itself
            let visualEffect = NSVisualEffectView(frame: window.contentView!.bounds)
            visualEffect.material = .hudWindow // Try .hudWindow for a lighter effect
            visualEffect.state = .active
            visualEffect.blendingMode = .behindWindow
            visualEffect.autoresizingMask = [.width, .height]
            
            // Insert the visual effect view at the BACK of the view hierarchy
            if let contentView = window.contentView {
                contentView.addSubview(visualEffect, positioned: .below, relativeTo: contentView.subviews.first)
            }
            
            // Standard window properties
            window.styleMask.insert(.resizable)
            window.styleMask.insert(.miniaturizable)
            window.setFrame(NSRect(x: window.frame.origin.x,
                                  y: window.frame.origin.y,
                                  width: 500,
                                  height: 800), display: true)
            window.minSize = NSSize(width: 300, height: 400)
            window.maxSize = NSSize(width: 1200, height: 1200)
        }
    }
    
    override func viewWillAppear() {
        super.viewWillAppear()
        if let window = self.view.window {
            window.styleMask.insert(.resizable)
            window.styleMask.insert(.miniaturizable)
        }
    }
#else
    // For iOS, viewWillAppear needs an animated parameter
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // iOS-specific code if needed
    }
#endif

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
#if os(iOS)
        webView.evaluateJavaScript("show('ios')")
        webView.evaluateJavaScript("iosKeyboardHandler()")
#elseif os(macOS)
        webView.evaluateJavaScript("show('mac')")

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                return
            }

            DispatchQueue.main.async {
                if #available(macOS 13, *) {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
                } else {
                    webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
                }
            }
        }
#endif
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
#if os(macOS)
        if (message.body as! String != "close") {
            return
        }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                return
            }

            DispatchQueue.main.async {
                NSApp.terminate(self)
            }
        }
#elseif os(iOS)
        if (message.body as! String == "close") {
            DispatchQueue.main.async {
                UIApplication.shared.perform(#selector(NSXPCConnection.suspend))
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    exit(0)
                }
            }
        }
#endif
    }
}
