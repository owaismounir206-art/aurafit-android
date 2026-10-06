package com.aurafit.app

import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

class DailyDeadlineWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val sharedPrefs = applicationContext.getSharedPreferences("AuraFitPrefs", Context.MODE_PRIVATE)
        val todayState = sharedPrefs.getString("TODAY_STATE", "SCHEDULED") ?: "SCHEDULED"

        if (todayState == "SCHEDULED" || todayState == "IN_PROGRESS") {
            // Apply Loss Aversion Penalty
            val penaltyType = sharedPrefs.getString("PENALTY_TYPE", "PHYSICAL") ?: "PHYSICAL"
            val currentBurpeesDebt = sharedPrefs.getInt("BURPEES_DEBT", 0)
            val updatedBurpees = currentBurpeesDebt + 50
            
            sharedPrefs.edit()
                .putString("TODAY_STATE", "MISSED")
                .putInt("CURRENT_STREAK", 0)
                .putInt("BURPEES_DEBT", updatedBurpees)
                .apply()

            // Trigger Android System Notification
            showPenaltyNotification(penaltyType, updatedBurpees)
        }

        return Result.success()
    }

    private fun showPenaltyNotification(penaltyType: String, burpeesDebt: Int) {
        if (ContextCompat.checkSelfPermission(
                applicationContext,
                android.Manifest.permission.POST_NOTIFICATIONS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val message = when (penaltyType) {
            "PHYSICAL" -> "🚨 Sessione non certificata! La tua streak è azzerata. Debito: +50 Burpees (Totale: $burpeesDebt)."
            "SOCIAL" -> "🚨 Infrazione pubblicata sullo Squad Wall! Streak azzerata."
            "FINANCIAL" -> "🚨 Penale finanziaria registrata nel salvadanaio di gruppo. Streak azzerata."
            else -> "🚨 Sessione scaduta alle 23:59. Streak azzerata per Loss Aversion."
        }

        val builder = NotificationCompat.Builder(applicationContext, AuraFitApplication.CHANNEL_PENALTY_ALERT)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle("AuraFit: Scadenza 23:59 Eseguita")
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)

        NotificationManagerCompat.from(applicationContext).notify(1001, builder.build())
    }
}
