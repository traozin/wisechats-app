<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Debug\ExceptionHandler;
use App\Exceptions\Handler as AppHandler;
use App\Models\OrderItem;
use App\Observers\OrderItemObserver;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        $this->app->singleton(
            ExceptionHandler::class,
            AppHandler::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        OrderItem::observe(OrderItemObserver::class);
    }
}
