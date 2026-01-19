/**
 * Approvals Panel Component
 * Displays pending tasks and approval workflows
 */

import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export function ApprovalsPanel() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  const { data: pendingData, isLoading } = trpc.approvals.getPendingTasks.useQuery();
  const { mutate: approveTask, isPending: approving } = trpc.approvals.approveTask.useMutation();
  const { mutate: rejectTask, isPending: rejecting } = trpc.approvals.rejectTask.useMutation();
  const { mutate: executeTask, isPending: executing } = trpc.approvals.executeTask.useMutation();

  const pendingTasks = pendingData?.pendingTasks || [];

  const handleApprove = (taskId: string) => {
    approveTask(
      { taskId, notes: approvalNotes },
      {
        onSuccess: () => {
          setSelectedTask(null);
          setApprovalNotes("");
        },
      }
    );
  };

  const handleReject = (taskId: string) => {
    rejectTask(
      { taskId, reason: rejectReason },
      {
        onSuccess: () => {
          setSelectedTask(null);
          setRejectReason("");
        },
      }
    );
  };

  const handleExecute = (taskId: string) => {
    executeTask(
      { taskId },
      {
        onSuccess: () => {
          setSelectedTask(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-slate-400">Loading approvals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Approvals</h2>
        <div className="text-sm text-slate-400">
          {pendingTasks.length} pending task{pendingTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tasks List */}
      {pendingTasks.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTasks.map((task: any) => (
            <div
              key={task.id}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{task.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              </div>

              {/* Action Details */}
              <div className="mb-4 p-3 bg-black bg-opacity-30 rounded text-sm text-slate-300">
                <p className="font-mono">
                  <span className="text-slate-500">Action:</span> {task.action}
                </p>
              </div>

              {/* Approval Controls */}
              {selectedTask === task.id ? (
                <div className="space-y-3 p-3 bg-black bg-opacity-20 rounded">
                  <textarea
                    placeholder="Add approval notes (optional)"
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(task.id)}
                      disabled={approving}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      onClick={() => setSelectedTask(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="border-t border-slate-600 pt-3">
                    <textarea
                      placeholder="Rejection reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={2}
                    />
                    <Button
                      onClick={() => handleReject(task.id)}
                      disabled={rejecting || !rejectReason.trim()}
                      variant="destructive"
                      className="w-full mt-2"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedTask(task.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Review
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Emergency Stop Section */}
      <div className="p-4 bg-red-900 bg-opacity-20 border border-red-700 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-red-300">Emergency Controls</h3>
        </div>
        <p className="text-sm text-red-200 mb-3">
          Pause all workflows immediately if needed. You can resume them later.
        </p>
        <Button
          variant="destructive"
          className="w-full"
        >
          Pause All Workflows
        </Button>
      </div>
    </div>
  );
}
