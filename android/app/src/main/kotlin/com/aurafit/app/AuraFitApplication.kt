package com.aurafit.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import android.util.Log
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.Calendar
import java.util.concurrent.TimeUnit

class AuraFitApplication : Application() {

    companion object {
        const val CHANNEL_PENALTY_ALERT = "CHANNEL_PENALTY_ALERT"
    }

    override fun onCreate() {
        super.onCreate()
        try {
            createNotificationChannels()
        } catch (e: Exception) {
            Log.e("AuraFit", "Errore creazione canali notifica", e)
        }

        try {
            scheduleDailyDeadlineWorker()
        } catch (e: Exception) {
            Log.e("AuraFit", "Errore inizializzazione WorkManager", e)
        }
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = getString(R.string.channel_penalty_name)
            val descriptionText = getString(R.string.channel_penalty_description)
            val importance = NotificationManager.IMPORTANCE_HIGH
            val channel = NotificationChannel(CHANNEL_PENALTY_ALERT, name, importance).apply {
                description = descriptionText
                enableVibration(true)
            }
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }

    private fun scheduleDailyDeadlineWorker() {
        val calendar = Calendar.getInstance()
        val now = calendar.timeInMillis

        // Target 23:59:00 of the current day
        calendar.set(Calendar.HOUR_OF_DAY, 23)
        calendar.set(Calendar.MINUTE, 59)
        calendar.set(Calendar.SECOND, 0)
        
        var initialDelay = calendar.timeInMillis - now
        if (initialDelay < 0) {
            initialDelay += TimeUnit.DAYS.toMillis(1)
        }

        val dailyWorkRequest = PeriodicWorkRequestBuilder<DailyDeadlineWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(initialDelay, TimeUnit.MILLISECONDS)
            .build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "DailyDeadlineWorker",
            ExistingPeriodicWorkPolicy.UPDATE,
            dailyWorkRequest
        )
    }
}
