"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BadgePlus, BadgeMinus /* Filter */, Gift, Info } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { RedeemPointsModal } from "./redeem-points-modal";
import { useGetStatistics } from "@/hooks/useGetStatistics";

export function PointsHistory({
  availablePoints,
  getStatistics,
}: {
  availablePoints: number;
  getStatistics: () => void;
}) {
  const { getGetPointHistory, data, isLoading } = useGetPointHistory({
    polling: true,
    pollingInterval: 30000,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  useEffect(() => {
    getGetPointHistory(page, 10);
  }, [page]);

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
  const handleRedeemSuccess = () => {
    // Refresh the transactions list after successful redemption
    getGetPointHistory(page, 10);
    getStatistics();
  };

  // const handleFilterChange = (
  //   key: "type" | "category",
  //   value: string | undefined
  // ) => {
  //   if (value === "all") {
  //     const newFilter = { ...filter };
  //     delete newFilter[key];
  //     setFilter(newFilter);
  //   } else {
  //     setFilter({ ...filter, [key]: value as any });
  //   }
  //   setPage(1);
  // };

  // const uniqueCategories = [
  //   "Purchase",
  //   "Travel",
  //   "Shopping",
  //   "Promotion",
  //   "Referral",
  //   "Bonus",
  // ];
  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryText = (expiryDate: string | undefined): string => {
    if (!expiryDate) return "-";

    const today = new Date();
    const expiry = new Date(expiryDate);

    if (expiry < today) {
      return "Expired";
    }

    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);

    if (daysUntilExpiry === 1) {
      return "Expires Today";
    } else if (daysUntilExpiry === 0) {
      return "Expired";
    } else {
      return format(expiry, "MMM dd, yyyy");
    }
  };

  return (
    <>
      <Card className="min-h-[570px] h-auto relative">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Points History</CardTitle>
            <CardDescription>Your recent points activities</CardDescription>
          </div>

          <Button
            onClick={() => setIsRedeemModalOpen(true)}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Gift className="h-4 w-4" />
            Redeem Points
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="space-y-4 mb-8">
                {data?.data.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[400px]  text-center py-6">
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
                      reference,
                      source,
                      createdAt,
                      transactionReference,
                      expirationDate,
                      expiredAt,
                      conversionRate,
                    }: PointTransaction) => {
                      return (
                        <div
                          key={id}
                          className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div
                            className={cn(`rounded-full p-2`, {
                              "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400":
                                type === PointsType.Adding,
                              "bg-red-100 dark:bg-red-400/10 text-red-600 dark:text-red-400":
                                type === PointsType.Expired,
                              "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400":
                                type === PointsType.Spending,
                              "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400":
                                type === PointsType.Blocked ||
                                type === PointsType.Locked,
                            })}
                          >
                            {type === PointsType.Adding ? (
                              <BadgePlus className="h-5 w-5" />
                            ) : (
                              <BadgeMinus className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col gap-2">
                            <p className="font-medium flex items-center gap-2 truncate text-lg">
                              {description || "-"}
                              {conversionRate && (
                                <div className="flex items-center gap-1 text-xs w-fit text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                                  <Info className="h-3 w-3" />
                                  <span>
                                    {conversionRate?.points} pts ={" "}
                                    {conversionRate?.currency} Unit Currency
                                  </span>
                                </div>
                              )}
                            </p>
                            <p className="text-sm font-normal leading-none">
                              <span className="font-bold">
                                Reference:&nbsp;
                              </span>
                              {reference}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <p>
                                <span className="font-bold">Date:&nbsp;</span>
                                {format(new Date(createdAt), "MMM dd, yyyy")}
                              </p>
                              <p className="text-sm capitalize">
                                <span className="font-bold">Source:&nbsp;</span>
                                {source}
                              </p>
                              {transactionReference ? (
                                <p className="text-sm capitalize">
                                  <span className="font-bold">
                                    Transaction Reference:&nbsp;
                                  </span>
                                  {transactionReference}
                                </p>
                              ) : null}
                              {expirationDate && type !== PointsType.Expired ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  <span>Expiry Date: </span>
                                  <span>
                                    {getExpiryText(
                                      expirationDate?.toString() || ""
                                    )}
                                  </span>
                                </p>
                              ) : null}
                              {type === PointsType.Expired ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  <span>Expired At: </span>
                                  <span>
                                    {expiredAt
                                      ? format(expiredAt, "MMM dd, yyyy")
                                      : "-"}
                                  </span>
                                </p>
                              ) : null}
                              {/* <span>•</span> */}
                              {/* <span>{category}</span> */}
                            </div>
                          </div>
                          <div
                            className={cn("text-right font-medium", {
                              "text-green-600 dark:text-green-400":
                                type === PointsType.Adding,
                              "text-red-600 dark:text-red-400":
                                type === PointsType.Expired,
                              "text-amber-600 dark:text-amber-400":
                                type === PointsType.Spending,
                              "text-gray-600 dark:text-gray-400":
                                type === PointsType.Blocked ||
                                type === PointsType.Locked,
                            })}
                          >
                            {type === PointsType.Adding ? "+" : "-"}
                            {points.toLocaleString()} points
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>

              {data?.data && data?.data.length > 0 && (
                <div className="flex items-center justify-between absolute bottom-1 w-full pr-14 pl-6 my-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {Math.min((page - 1) * 10 + 1, total)} to{" "}
                    {Math.min(page * 10, total)} of {total} entries
                  </p>
                  <div className="flex items-center gap-4 cursor-pointer">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page * 10 >= total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {isRedeemModalOpen && (
        <RedeemPointsModal
          open={isRedeemModalOpen}
          onOpenChange={setIsRedeemModalOpen}
          availablePoints={availablePoints}
          onSuccess={handleRedeemSuccess}
        />
      )}
    </>
  );
}
