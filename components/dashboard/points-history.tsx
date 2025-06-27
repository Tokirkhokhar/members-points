"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BadgePlus, BadgeMinus /* Filter */ } from "lucide-react";
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
import { PointTransactionType } from "@/enums";
import { getBadgeColorClass, getPointsColorClass } from "@/lib/utils";

export function PointsHistory() {
  const { getGetPointHistory, data, isLoading } = useGetPointHistory();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<{
    type?: PointTransactionType.Earned | "redeemed";
    category?: string;
  }>({});

  useEffect(() => {
    getGetPointHistory(page, 10, filter);
  }, [page, filter]);

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

  return (
    <Card className="min-h-[570px] h-auto relative">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activities</CardDescription>
        </div>

        {/* <div className="flex flex-col sm:flex-row gap-2">
          <Select
            onValueChange={(value) =>
              handleFilterChange(
                "type",
                value === "all" ? undefined : (value as any)
              )
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All activities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All activities</SelectItem>
              <SelectItem value=PointTransactionType.Earned>Earned</SelectItem>
              <SelectItem value="redeemed">Redeemed</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Categories
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">Filter by category</h4>
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleFilterChange("category", undefined)}
                  >
                    All categories
                  </Button>
                  {uniqueCategories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        filter.category === category ? "secondary" : "ghost"
                      }
                      className="justify-start"
                      onClick={() => handleFilterChange("category", category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div> */}
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
          <>
            <div className="space-y-4 mb-8">
              {data?.data.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px]  text-center py-6">
                  <p className="text-muted-foreground">No transactions found</p>
                </div>
              ) : (
                data?.data.map((transaction: PointTransaction) => {
                  const badgeColorClass = getBadgeColorClass(transaction.type);
                  const pointsColorClass = getPointsColorClass(
                    transaction.type
                  );
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`rounded-full p-2 ${badgeColorClass}`}>
                        {transaction.type === PointTransactionType.Earned ? (
                          <BadgePlus className="h-5 w-5" />
                        ) : (
                          <BadgeMinus className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-lg">
                          {transaction.description || "-"}
                        </p>
                        <p className="text-sm font-normal leading-none">
                          <span className="font-bold">Reference:&nbsp;</span>
                          {transaction.reference}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <p>
                            <span className="font-bold">Date:&nbsp;</span>
                            {format(
                              new Date(transaction.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </p>
                          <p className="text-sm capitalize">
                            <span className="font-bold">Source:&nbsp;</span>
                            {transaction.source}
                          </p>
                          {transaction?.transactionReference ? (
                            <p className="text-sm capitalize">
                              <span className="font-bold">
                                Transaction Reference:&nbsp;
                              </span>
                              {transaction.transactionReference}
                            </p>
                          ) : null}
                          {/* <span>•</span> */}
                          {/* <span>{transaction.category}</span> */}
                        </div>
                      </div>
                      <div
                        className={`text-right font-medium ${pointsColorClass}`}
                      >
                        {transaction.type === PointTransactionType.Earned
                          ? "+"
                          : "-"}
                        {transaction.points.toLocaleString()} points
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {data?.data && data?.data.length > 0 && (
              <div className="flex items-center justify-between absolute bottom-1 w-full pr-14 pl-6">
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
