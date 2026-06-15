"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItemData[];
}

function truncateLabel(label: string, maxLength: number): string {
  if (label.length <= maxLength) return label;
  return `${label.slice(0, maxLength - 1)}…`;
}

function getDisplayBreadcrumbs(
  breadcrumbs: BreadcrumbItemData[],
  maxLength: number,
): BreadcrumbItemData[] {
  const withoutRoot = breadcrumbs.filter(
    (item) => item.label !== "Преподаватель",
  );

  return withoutRoot.map((item, index, list) => ({
    ...item,
    label:
      index === list.length - 1
        ? truncateLabel(item.label, maxLength)
        : truncateLabel(item.label, Math.min(maxLength, 18)),
  }));
}

function getMobileBreadcrumbs(
  breadcrumbs: BreadcrumbItemData[],
): Array<BreadcrumbItemData & { ellipsis?: boolean }> {
  const items = breadcrumbs.filter((item) => item.label !== "Преподаватель");

  if (items.length <= 2) {
    return items.map((item) => ({
      ...item,
      label: truncateLabel(item.label, 22),
    }));
  }

  return [
    { label: "…", ellipsis: true },
    {
      ...items[items.length - 2],
      label: truncateLabel(items[items.length - 2].label, 16),
    },
    {
      ...items[items.length - 1],
      label: truncateLabel(items[items.length - 1].label, 22),
    },
  ];
}

function BreadcrumbTrail({
  items,
  className,
}: {
  items: Array<BreadcrumbItemData & { ellipsis?: boolean }>;
  className?: string;
}) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-nowrap">
        {items.map((crumb, index) => (
          <BreadcrumbItem key={`${crumb.label}-${index}`} className="min-w-0">
            {index > 0 && <BreadcrumbSeparator />}
            {crumb.ellipsis ? (
              <BreadcrumbEllipsis className="size-6" />
            ) : crumb.href ? (
              <BreadcrumbLink
                href={crumb.href}
                className="block max-w-[9rem] truncate text-xs sm:max-w-none sm:text-sm"
              >
                {crumb.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="block max-w-[10rem] truncate text-xs sm:max-w-none sm:text-sm">
                {crumb.label}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  const desktopBreadcrumbs = breadcrumbs
    ? getDisplayBreadcrumbs(breadcrumbs, 32)
    : [];
  const mobileBreadcrumbs = breadcrumbs
    ? getMobileBreadcrumbs(breadcrumbs)
    : [];

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden px-3 sm:px-4">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mr-1 hidden h-4 shrink-0 sm:block"
        />

        {breadcrumbs && breadcrumbs.length > 0 && (
          <>
            <div className="min-w-0 flex-1 md:hidden">
              <BreadcrumbTrail items={mobileBreadcrumbs} />
            </div>
            <div className="hidden min-w-0 flex-1 md:block">
              <BreadcrumbTrail items={desktopBreadcrumbs} />
            </div>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 px-2 sm:gap-2 sm:px-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
