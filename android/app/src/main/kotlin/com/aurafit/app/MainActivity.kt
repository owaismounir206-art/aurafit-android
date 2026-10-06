package com.aurafit.app

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.ActiveCaloriesBurnedRecord
import androidx.health.connect.client.records.ExerciseSessionRecord
import androidx.health.connect.client.records.HeartRateRecord
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewAssetLoader
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    private val healthConnectClient by lazy {
        try {
            if (HealthConnectClient.getSdkStatus(this) == HealthConnectClient.SDK_AVAILABLE) {
                HealthConnectClient.getOrCreate(this)
            } else {
                null
            }
        } catch (e: Exception) {
            Log.w("AuraFit", "HealthConnectClient init failure", e)
            null
        }
    }

    private val healthPermissions = setOf(
        HealthPermission.getReadPermission(HeartRateRecord::class),
        HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
        HealthPermission.getReadPermission(ExerciseSessionRecord::class)
    )

    private val requestPermissions = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { grantedPermissions ->
        if (grantedPermissions.containsAll(healthPermissions)) {
            Toast.makeText(this, "Permessi Health Connect Concessi (Proof of Work Attiva)", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Permessi parziali. Modalità Fallback/Mock attiva.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setupWebView()
        setupBackNavigation()
        checkAndRequestHealthConnect()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView = findViewById(R.id.webView)

        // AndroidX WebViewAssetLoader serves local assets over HTTPS domain
        // This eliminates file:// CORS and ES module restrictions
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)
                Log.e("AuraFit", "WebView error: ${error.description} on ${request.url}")
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(message: android.webkit.ConsoleMessage?): Boolean {
                Log.d("AuraFitJS", "${message?.message()} -- From line ${message?.lineNumber()} of ${message?.sourceId()}")
                return true
            }
        }

        // Bridge interface between Android Native and React Web App
        webView.addJavascriptInterface(AndroidBridge(this), "AndroidHealthConnect")

        // Load application through secure AssetLoader
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::webView.isInitialized && webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })
    }

    fun requestHealthPermissions() {
        try {
            val client = healthConnectClient ?: return
            lifecycleScope.launch {
                try {
                    val granted = client.permissionController.getGrantedPermissions()
                    if (!granted.containsAll(healthPermissions)) {
                        requestPermissions.launch(healthPermissions)
                    }
                } catch (e: Exception) {
                    Log.w("AuraFit", "Error requesting health permissions", e)
                }
            }
        } catch (e: Exception) {
            Log.w("AuraFit", "Health Connect error", e)
        }
    }

    private fun checkAndRequestHealthConnect() {
        val client = healthConnectClient
        if (client == null) {
            Log.i("AuraFit", "Health Connect non disponibile, fallback a mock mode.")
            return
        }

        lifecycleScope.launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                if (!granted.containsAll(healthPermissions)) {
                    requestPermissions.launch(healthPermissions)
                }
            } catch (e: Exception) {
                Log.w("AuraFit", "Health Connect permission query error", e)
            }
        }
    }

    class AndroidBridge(private val activity: MainActivity) {
        @JavascriptInterface
        fun isNativeAndroid(): Boolean = true

        @JavascriptInterface
        fun requestPermissions() {
            activity.runOnUiThread {
                activity.requestHealthPermissions()
            }
        }
    }
}
