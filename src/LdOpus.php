<?php

declare(strict_types=1);

namespace Lohndruckerei\Opus;

use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;

/**
 * Opus – Steuerung der internen Produktion (Arbeitsstationen, Routing-Regeln).
 *
 * Konzept: docs/KONZEPT.md · Schnittstellen: docs/INTEGRATION.md · Entwicklung: docs/ENTWICKLUNG.md
 */
class LdOpus extends Plugin
{
    /**
     * Tabellen des Plugins, abhängige zuerst. Mit jeder neuen Migration ergänzen.
     */
    public const TABLES = [];

    /**
     * Ohne „Daten behalten“ werden alle Tabellen des Plugins entfernt.
     */
    public function uninstall(UninstallContext $uninstallContext): void
    {
        parent::uninstall($uninstallContext);

        if ($uninstallContext->keepUserData()) {
            return;
        }

        /** @var Connection $connection */
        $connection = $this->container->get(Connection::class);

        foreach (self::TABLES as $table) {
            $connection->executeStatement('DROP TABLE IF EXISTS `' . $table . '`');
        }
    }
}
