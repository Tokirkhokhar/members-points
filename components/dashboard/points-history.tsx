"use client";

import { useState, useEffect } from "react";
import {
  BadgePlus,
  BadgeMinus,
  UnlockIcon,
  LockIcon,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { useGetPointHistory } from "@/hooks/getGetPointHistory";
import { PointTransaction } from "@/services/points-service";
import { PointsType } from "@/enums";
import { cn, formatDateTime } from "@/lib/utils";

export function PointsHistory({
  selectedWallet,
}: {
  selectedWallet?: {
    walletTypeId: string;
    unitsName?: string;
  };
}) {
  const { getGetPointHistory, data, isLoading } = useGetPointHistory();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getGetPointHistory(page, 10, selectedWallet?.walletTypeId);
  }, [page, selectedWallet]);

  useEffect(() => {
    if (data) {
      setTotal(data?.total);
    }
  }, [data]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(total / 10)) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Card className="min-h-[570px] h-auto relative overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              Points History
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your recent points activities
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {isLoading ? (
            <div className="space-y-4 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="space-y-2 sm:space-y-3 mb-8">
                {data?.data.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] text-center py-6 px-4">
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </div>
                ) : (
                  data?.data.map(
                    ({
                      id,
                      type,
                      points,
                      description,
                      createdAt,
                      transactionReference,
                      expiredAt,
                      unlockAt,
                      locked,
                    }: PointTransaction) => {
                      return (
                        <div
                          key={id}
                          className="flex flex-col sm:flex-row items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-muted-foreground/10"
                        >
                          <div
                            className={cn(`rounded-full p-2`, {
                              "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400":
                                type === PointsType.Adding,
                              "bg-red-100 dark:bg-red-400/10 text-red-600 dark:text-red-400":
                                type === PointsType.Expired,
                              "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400":
                                type === PointsType.Spending,
                              "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400":
                                type === PointsType.Blocked ||
                                type === PointsType.Locked,
                            })}
                          >
                            {[
                              PointsType.Adding,
                              PointsType.Locked,
                              PointsType.Adjustment,
                            ].includes(type) ? (
                              <BadgePlus className="h-5 w-5" />
                            ) : (
                              <BadgeMinus className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 w-full">
                            <p className="font-medium text-base sm:text-lg text-foreground line-clamp-2">
                              {description || "-"}
                            </p>
                            <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs sm:text-sm text-muted-foreground">
                              <p className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span className="font-semibold">
                                  Date:&nbsp;
                                </span>
                                {formatDateTime(createdAt)}
                              </p>
                              {transactionReference ? (
                                <p className="flex items-center gap-2 text-sm capitalize">
                                  <span className="font-semibold">
                                    Transaction Reference:&nbsp;
                                  </span>
                                  {transactionReference}
                                </p>
                              ) : null}
                              {expiredAt &&
                              ![PointsType.Expired, PointsType.Locked].includes(
                                type
                              ) ? (
                                <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-semibold">
                                    Expiry Date:&nbsp;
                                  </span>
                                  <span>{formatDateTime(expiredAt)}</span>
                                </p>
                              ) : null}
                              {expiredAt && type === PointsType.Expired ? (
                                <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                  <Calendar className="h-4 w-4" />
                                  <span className="font-semibold">
                                    Expired At:&nbsp;
                                  </span>
                                  <span>{formatDateTime(expiredAt)}</span>
                                </p>
                              ) : null}
                              {unlockAt && type === PointsType.Locked ? (
                                <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                  <LockIcon className="h-4 w-4" />
                                  <span className="font-semibold">
                                    Unlock Date:&nbsp;
                                  </span>
                                  <span>{formatDateTime(unlockAt)}</span>
                                </p>
                              ) : null}
                              {unlockAt && type === PointsType.Adding && (
                                <p className="flex items-center gap-2 text-sm">
                                  <UnlockIcon className="h-4 w-4" />
                                  <span className="font-semibold">
                                    Unlocked At:&nbsp;
                                  </span>
                                  <span>{formatDateTime(unlockAt)}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "mt-2 sm:mt-0 text-right font-medium whitespace-nowrap text-sm sm:text-base",
                              {
                                "text-green-600 dark:text-green-400":
                                  type === PointsType.Adding,

                                "text-rose-500 dark:text-rose-400":
                                  type === PointsType.Expired,

                                "text-orange-500 dark:text-orange-400":
                                  type === PointsType.Spending,

                                "text-gray-500 dark:text-gray-400":
                                  type === PointsType.Blocked ||
                                  type === PointsType.Locked,
                              }
                            )}
                          >
                            {[
                              PointsType.Adding,
                              PointsType.Locked,
                              PointsType.Adjustment,
                            ].includes(type)
                              ? "+"
                              : "-"}
                            {points.toLocaleString()}&nbsp;
                            {selectedWallet?.unitsName}
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>

              {data?.data && data?.data.length > 0 && (
                <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                        Showing{" "}
                        <span className="font-medium">
                          {Math.min((page - 1) * 10 + 1, total)}
                        </span>{" "}
                        to&nbsp;
                        <span className="font-medium">
                          {Math.min(page * 10, total)}
                        </span>{" "}
                        of <span className="font-medium">{total}</span> entries
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm px-3 sm:px-4"
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs sm:text-sm px-3 sm:px-4"
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page * 10 >= total}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
